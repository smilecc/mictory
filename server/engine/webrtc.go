package engine

import (
	"encoding/json"
	"errors"
	"fmt"
	"github.com/asynkron/protoactor-go/actor"
	"github.com/pion/interceptor"
	"github.com/pion/rtcp"
	"github.com/pion/sdp/v3"
	"github.com/pion/webrtc/v3"
	"github.com/sirupsen/logrus"
	"time"
)

type RTCSession struct {
	PeerConnection *webrtc.PeerConnection
	SessionId      string
	LocalTrack     *webrtc.TrackLocalStaticRTP
	PID            *actor.PID
}

func NewRTCSession(sessionId string) *RTCSession {
	// 创建会话对象
	peerConnection, _ := createPeerConnection()
	session := &RTCSession{
		SessionId:      sessionId,
		PeerConnection: peerConnection,
	}

	session.StartHandleRTCEvent()

	// 创建actor
	sessionProps := actor.PropsFromProducer(func() actor.Actor {
		return session
	})
	session.PID = GlobalActorSystem.Root.Spawn(sessionProps)
	GlobalEngine.InsertRTCSessionPID(session)

	return session
}

// createPeerConnection 创建WebRTC对等连接
func createPeerConnection() (*webrtc.PeerConnection, error) {
	// 创建RTC基础配置
	settingEngine := webrtc.SettingEngine{}
	settingEngine.SetLite(true)
	//settingEngine.SetInterfaceFilter(func(in string) bool { return in == r.engine.Interface })
	//settingEngine.SetNAT1To1IPs([]string{r.engine.IP}, webrtc.ICECandidateTypeHost)
	settingEngine.SetICETimeouts(10*time.Second, 30*time.Second, 2*time.Second)
	//settingEngine.SetEphemeralUDPPortRange(r.engine.PortMin, r.engine.PortMax)
	settingEngine.SetReceiveMTU(8192)

	// 创建RTC媒体编码配置
	mediaEngine := &webrtc.MediaEngine{}
	opusChrome := webrtc.RTPCodecParameters{
		RTPCodecCapability: webrtc.RTPCodecCapability{MimeType: webrtc.MimeTypeOpus, ClockRate: 48000, Channels: 2, SDPFmtpLine: "minptime=10;useinbandfec=1", RTCPFeedback: nil},
		PayloadType:        111,
	}
	//opusFirefox := webrtc.RTPCodecParameters{
	//	RTPCodecCapability: webrtc.RTPCodecCapability{MimeType: webrtc.MimeTypeOpus, ClockRate: 48000, Channels: 2, SDPFmtpLine: "minptime=10;useinbandfec=1", RTCPFeedback: nil},
	//	PayloadType:        109,
	//}
	_ = mediaEngine.RegisterCodec(opusChrome, webrtc.RTPCodecTypeAudio)
	//_ = mediaEngine.RegisterCodec(opusFirefox, webrtc.RTPCodecTypeAudio)
	//mediaEngine.RegisterDefaultCodecs()

	// 创建拦截器注册表
	registry := &interceptor.Registry{}
	err := webrtc.RegisterDefaultInterceptors(mediaEngine, registry)
	if err != nil {
		logrus.Error(err)
		return nil, err
	}

	// 创建RTC连接
	api := webrtc.NewAPI(webrtc.WithMediaEngine(mediaEngine), webrtc.WithSettingEngine(settingEngine), webrtc.WithInterceptorRegistry(registry))
	peerConnection, err := api.NewPeerConnection(webrtc.Configuration{
		//ICEServers: []webrtc.ICEServer{
		//	{
		//		URLs: []string{"stun:stun.gmx.net:3478"},
		//	},
		//},
		BundlePolicy:  webrtc.BundlePolicyMaxBundle,
		RTCPMuxPolicy: webrtc.RTCPMuxPolicyRequire,
	})

	if err != nil {
		logrus.Error(err)
		return nil, err
	}

	return peerConnection, nil
}

// HandleRemoteSDPOffer 当接收到远程SDP Offer时，创建应答
func (s *RTCSession) HandleRemoteSDPOffer(sdpOffer string) {
	var offer webrtc.SessionDescription
	_ = json.Unmarshal([]byte(sdpOffer), &offer)

	parser := sdp.SessionDescription{}
	_ = parser.Unmarshal([]byte(offer.SDP))

	err := s.PeerConnection.SetRemoteDescription(offer)
	if err != nil {
		logrus.Fatal(err)
	}

	_, err = s.CreateSDPAndSend(webrtc.SDPTypeAnswer)
	if err != nil {
		logrus.Fatal(err)
	}
}

func (s *RTCSession) CreateSDPAndSend(sdpType webrtc.SDPType) (*webrtc.SessionDescription, error) {
	var sessionDescription webrtc.SessionDescription
	var websocketEvent string
	var err error

	switch sdpType {
	case webrtc.SDPTypeOffer:
		offer, createErr := s.PeerConnection.CreateOffer(nil)
		sessionDescription = offer
		err = createErr
		websocketEvent = "rtc_offer"
	case webrtc.SDPTypeAnswer:
		answer, createErr := s.PeerConnection.CreateAnswer(nil)
		sessionDescription = answer
		err = createErr
		websocketEvent = "rtc_answer"
	default:
		err = errors.New("CreateSDPAndSend失败，未知SDP类型")
	}

	if err != nil {
		return &webrtc.SessionDescription{}, err
	}
	err = s.PeerConnection.SetLocalDescription(sessionDescription)
	if err != nil {
		return nil, err
	}

	gatherComplete := webrtc.GatheringCompletePromise(s.PeerConnection)
	<-gatherComplete

	// 将Offer发送给客户端
	offer := s.PeerConnection.LocalDescription()
	jsonSDP, _ := json.Marshal(offer)
	jsonData, _ := json.Marshal(joinRoomAnswer{SDP: string(jsonSDP), SessionId: s.SessionId})
	GlobalEngine.SendJsonToSession(s.SessionId, &WebsocketMessage{Event: websocketEvent, Data: string(jsonData)})

	logrus.Infof("将SDP[type=%d]发送给客户端", sdpType)

	return offer, err
}

// StartHandleRTCEvent 开始监听RTC事件
func (s *RTCSession) StartHandleRTCEvent() {
	// 监听新增轨道
	s.PeerConnection.OnTrack(func(remote *webrtc.TrackRemote, receiver *webrtc.RTPReceiver) {
		// 根据远端的轨道编码创建一个本地轨道
		localTrack, err := webrtc.NewTrackLocalStaticRTP(remote.Codec().RTPCodecCapability, s.SessionId, s.SessionId)
		if err != nil {
			logrus.WithField("SessionId", s.SessionId).Error("创建本地Track失败", err)
			return
		}

		go func() {
			ticker := time.NewTicker(time.Second * 3)
			for range ticker.C {
				errSend := s.PeerConnection.WriteRTCP([]rtcp.Packet{&rtcp.PictureLossIndication{MediaSSRC: uint32(remote.SSRC())}})
				if errSend != nil {
					fmt.Println(errSend)
				}
			}
		}()

		s.LocalTrack = localTrack
		//go func() {
		//	t := time.NewTimer(10 * time.Second)
		//	defer t.Stop()
		//	<-t.C
		//
		//	stats := s.PeerConnection.GetStats()
		//	for _, s := range stats {
		//		logrus.Infof("report: %+v", s)
		//	}
		//}()
		//
		//s.PeerConnection.AddTrack(localTrack)

		//go func() {
		//	for {
		//		// Read the RTCP packets as they become available for our new remote track
		//		rtcpPackets, _, rtcpErr := receiver.ReadRTCP()
		//		if rtcpErr != nil {
		//			logrus.Error("rtcpErr", rtcpErr)
		//			return
		//		}
		//
		//		for _, r := range rtcpPackets {
		//			// Print a string description of the packets
		//			if stringer, canString := r.(fmt.Stringer); canString {
		//				fmt.Printf("Received RTCP Packet: %v", stringer.String())
		//			}
		//		}
		//	}
		//}()

		go func() {
			// 循环读取数据包发送给actor消费
			for {
				packet, _, err := remote.ReadRTP()
				if err != nil {
					logrus.WithField("SessionId", s.SessionId).Warning("媒体轨道终止", err)
					return
				}

				GlobalActorSystem.Root.Send(s.PID, RTCTrackCopyMessage{Packet: packet})
			}
		}()

	})

	s.PeerConnection.OnICECandidate(func(candidate *webrtc.ICECandidate) {
		//jsonData, _ := json.Marshal(candidate)
		//GlobalEngine.SendJsonToSession(s.SessionId, &WebsocketMessage{Event: "rtc_offer", Data: string(jsonData)})
	})

	s.PeerConnection.OnNegotiationNeeded(func() {
		logrus.Info("OnNegotiationNeeded")
		s.CreateSDPAndSend(webrtc.SDPTypeOffer)
	})

	//go func() {
	//	for _ = range time.Tick(time.Second * 3) {
	//		offer, err := s.CreateAndSendOffer()
	//		if err != nil && offer == nil {
	//			return
	//		}
	//	}
	//}()
}

func (s *RTCSession) Receive(ctx actor.Context) {
	switch msg := ctx.Message().(type) {
	case RTCTrackCopyMessage:
		if s.LocalTrack != nil {
			_ = s.LocalTrack.WriteRTP(msg.Packet)
		}
	case *actor.Stopped:
		_ = s.PeerConnection.Close()
	}
}
