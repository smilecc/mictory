import { IGainSetting } from "@renderer/stores/CommonStore";
import _ from "lodash";

export class Session {
  websocketUrl: string;
  websocket!: WebSocket;
  peerConnection?: RTCPeerConnection;
  isClosed: boolean = false;
  isJoined: boolean = false;
  userMedia!: MediaStream;
  sessionId: string = "";
  watchVolumeSessions: Set<string> = new Set();

  constructor(websocketUrl: string) {
    this.websocketUrl = websocketUrl;
    this.connectWebsocket();

    navigator.mediaDevices
      .getUserMedia({
        video: false,
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
        },
      })
      .then((media) => {
        console.log("初始化麦克风", media);
        this.modifyGain(media, "microphone");
        this.userMedia = media;
        this.watchVolumeSessions.add("MYSELF");
        this.watchMediaStreamVolume(this.userMedia, "MYSELF");
      })
      .catch((e) => {
        console.warn("用户无麦克风设备", e);
      });
  }

  connectWebsocket() {
    this.isClosed = false;
    this.websocket = new WebSocket(this.websocketUrl);
    this.startPing();
    this.handleEvent();
  }

  // 监听麦克风音量变化
  watchMediaStreamVolume(stream: MediaStream, sessionId: string) {
    this.watchVolumeSessions.add(sessionId);
    const audioContext = new AudioContext();
    const mediaStreamAudioSourceNode = audioContext.createMediaStreamSource(stream);
    const analyserNode = audioContext.createAnalyser();
    mediaStreamAudioSourceNode.connect(analyserNode);
    // 如果是自己说话则使用当前用户会话ID
    const getSessionId = () => (sessionId === "MYSELF" ? this.sessionId : sessionId);
    const onStopSpeak = _.debounce(() => {
      window.dispatchEvent(new CustomEvent("session:stop_speak", { detail: { sessionId: getSessionId() } }));
    }, 200);
    const onSpeak = _.throttle(
      () => {
        window.dispatchEvent(new CustomEvent("session:speak", { detail: { sessionId: getSessionId() } }));
        onStopSpeak();
      },
      100,
      {
        leading: true,
      }
    );

    const pcmData = new Float32Array(analyserNode.fftSize);
    const onFrame = () => {
      analyserNode.getFloatTimeDomainData(pcmData);
      let sumSquares = 0.0;
      for (const amplitude of pcmData) {
        sumSquares += amplitude * amplitude;
      }
      let volume = Math.sqrt(sumSquares / pcmData.length);
      if (volume > 0.05) {
        onSpeak();
      }

      if (this.watchVolumeSessions.has(sessionId)) {
        window.requestAnimationFrame(onFrame);
      }
    };
    window.requestAnimationFrame(onFrame);
  }

  startPing() {
    const valId = setInterval(() => {
      if (this.isClosed) {
        clearInterval(valId);
        return;
      }

      this.websocket.send(
        JSON.stringify({
          event: "ping",
          data: "",
        })
      );
    }, 10 * 1000);
  }

  handleEvent() {
    this.websocket.onmessage = async (e) => {
      console.log("收到WebSocket新消息", e.data);
      let message = JSON.parse(e.data) as Record<string, string>;
      let event = message.event;
      let data = JSON.parse(message.data);

      switch (event) {
        case "new_session":
          await this.onNewSessionEvent(data);
          break;
        case "rtc_offer":
          await this.onRTCOfferEvent(data);
          break;
        case "rtc_answer":
          await this.onRTCAnswerEvent(data);
          break;
        case "server_user_join":
          window.dispatchEvent(new CustomEvent("session:server_user_join", { detail: data }));
          break;
        case "server_user_exit":
          window.dispatchEvent(new CustomEvent("session:server_user_exit", { detail: data }));
          break;
      }
    };

    this.websocket.onclose = () => {
      console.log("WebSocket连接断开");
      this.isClosed = true;
    };
  }

  async auth(accessToken: string) {
    this.websocket.send(
      JSON.stringify({
        event: "auth",
        data: accessToken,
      })
    );
  }

  async joinRoom(roomId: string) {
    this.isJoined = true;
    this.peerConnection = new RTCPeerConnection({
      iceServers: [
        // {
        //   urls: "stun:stun.gmx.net:3478",
        // },
        {
          urls: "turn:106.54.172.71",
          username: "test",
          credential: "test",
        },
      ],
    });

    try {
      this.handlePeerConnectionEvent(this.peerConnection);
    } catch (e) {
      console.error(e);
    }

    // 给连接增加轨道
    this.userMedia?.getTracks()?.forEach((t) => {
      this.peerConnection?.addTrack(t);
      console.log(t);
    });

    // 创建Offer
    if (!this.userMedia) {
      // 如果没有音频设备，则创建一个接收器
      this.peerConnection.addTransceiver("audio");
    }

    let offer = await this.peerConnection.createOffer();
    await this.peerConnection.setLocalDescription(offer);
    let sdp = JSON.stringify(this.peerConnection.localDescription);

    // 发送加入房间消息
    this.websocket.send(
      JSON.stringify({
        event: "rtc_join_room",
        data: JSON.stringify({
          sessionId: this.sessionId,
          roomId,
          sdp,
        }),
      })
    );
  }

  handlePeerConnectionEvent(peerConnection: RTCPeerConnection) {
    peerConnection.ontrack = (event) => {
      console.log("RTC新轨道加入", event.track.id);

      // 创建Audio标签
      let el = document.createElement(event.track.kind) as HTMLAudioElement;
      let stream = event.streams[0];
      this.modifyGain(stream, "volume");
      el.id = `track-${event.track.id}`;
      el.srcObject = stream;
      el.autoplay = true;
      el.muted = true;
      document.getElementById("tracks")?.appendChild(el);
      console.log(event, stream.id);
      const sessionId = stream.id.split(";")[0];

      this.watchMediaStreamVolume(stream, sessionId);

      // 增加轨道移除事件
      el.srcObject!.onremovetrack = () => {
        console.log("RTC轨道移除", el.id);
        document.getElementById(el.id)?.remove();
        this.watchVolumeSessions.delete(sessionId);
      };
    };

    peerConnection.onicecandidate = (event) => {
      if (event.candidate === null) return;
      this.websocket.send(
        JSON.stringify({
          event: "candidate",
          data: JSON.stringify(event.candidate),
        })
      );
    };

    peerConnection.onconnectionstatechange = () => {
      console.log("RTC对等连接状态变化", peerConnection.connectionState);
    };
  }

  async onNewSessionEvent(data: any) {
    this.sessionId = data.sessionId;
  }

  async onRTCOfferEvent(data: any) {
    if (!this.peerConnection) {
      return;
    }

    // 创建Answer
    this.peerConnection.setRemoteDescription(JSON.parse(data.sdp));
    let sdp = await this.peerConnection.createAnswer();
    await this.peerConnection.setLocalDescription(sdp);
    this.websocket.send(
      JSON.stringify({
        event: "rtc_answer",
        data: JSON.stringify(sdp),
      })
    );
  }

  async onRTCAnswerEvent(data: any) {
    console.log(this.peerConnection, data.sdp);
    this.peerConnection?.setRemoteDescription(JSON.parse(data.sdp));
  }

  async exitRoom() {
    this.isJoined = false;
    this.websocket.send(
      JSON.stringify({
        event: "rtc_exit_room",
        data: "{}",
      })
    );
  }

  close() {
    this.isClosed = true;
    this.websocket.close();
  }

  modifyGain(stream: MediaStream, gainKey: keyof IGainSetting) {
    const getValue = () => {
      const globalGainValue = window._gainSetting?.[gainKey];
      return typeof globalGainValue === "number" ? globalGainValue / 100 : 1;
    };

    const ctx = new AudioContext();
    const gainNode = ctx.createGain();
    const source = ctx.createMediaStreamSource(stream);
    source.connect(gainNode).connect(ctx.destination);

    const onFrame = () => {
      gainNode.gain.value = getValue();
      gainNode.gain.linearRampToValueAtTime(getValue(), ctx.currentTime + 1);

      if (gainKey === "microphone") {
        window.requestAnimationFrame(onFrame);
      }
      if (gainKey === "volume" && !this.isClosed && this.isJoined) {
        window.requestAnimationFrame(onFrame);
      }
    };
    window.requestAnimationFrame(onFrame);
  }
}
