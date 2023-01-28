import _ from "lodash";

export class Session {
  websocketUrl: string;
  websocket!: WebSocket;
  peerConnection?: RTCPeerConnection;
  isClosed: boolean = false;
  userMedia!: MediaStream;
  sessionId: string = "";
  watchVolumeSessions: Set<string> = new Set();

  constructor(websocketUrl: string) {
    this.websocketUrl = websocketUrl;
    this.connectWebsocket();

    (async () => {
      this.userMedia = await navigator.mediaDevices.getUserMedia({
        video: false,
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
        },
      });

      this.watchVolumeSessions.add("MYSELF");
      this.watchMediaStreamVolume(this.userMedia, "MYSELF");
    })();
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
      window.dispatchEvent(
        new CustomEvent("session:stop_speak", { detail: { sessionId: getSessionId() } })
      );
    }, 1000);
    const onSpeak = _.throttle(
      () => {
        window.dispatchEvent(
          new CustomEvent("session:speak", { detail: { sessionId: getSessionId() } })
        );
        onStopSpeak();
      },
      500,
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
      if (volume > 0.01) {
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

    this.handlePeerConnectionEvent(this.peerConnection);

    // 给连接增加轨道
    this.userMedia?.getTracks()?.forEach((t) => {
      this.peerConnection?.addTrack(t);
      console.log(t);
    });

    // 创建Offer
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
      el.id = `track-${event.track.id}`;
      el.srcObject = stream;
      el.autoplay = true;
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
}
