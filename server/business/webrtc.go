package business

import (
	"errors"
	"github.com/pion/interceptor"
	"github.com/pion/rtcp"
	"github.com/pion/sdp/v3"
	"github.com/pion/webrtc/v3"
	"github.com/sirupsen/logrus"
	"github.com/zishang520/socket.io/socket"
	"time"
)

type WebRTCSession struct {
	PeerConnection *webrtc.PeerConnection
	LocalTrack     *webrtc.TrackLocalStaticRTP
	SessionId      string
}

func NewWebRTCSession(sessionId string) *WebRTCSession {
	peerConnection, _ := createPeerConnection()
	session := &WebRTCSession{
		PeerConnection: peerConnection,
		SessionId:      sessionId,
	}

	session.StartHandleEvent()

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

// StartHandleEvent 开始监听RTC事件
func (s *WebRTCSession) StartHandleEvent() {
	s.PeerConnection.OnTrack(func(remote *webrtc.TrackRemote, receiver *webrtc.RTPReceiver) {
		// 根据远端的轨道编码创建一个本地轨道
		localTrack, err := webrtc.NewTrackLocalStaticRTP(remote.Codec().RTPCodecCapability, s.SessionId, s.SessionId)
		if err != nil {
			logrus.WithField("sessionId", s.SessionId).Error("创建本地Track失败", err)
			return
		}

		// 定时反馈丢包情况
		go func() {
			ticker := time.NewTicker(time.Second * 3)
			for range ticker.C {
				errSend := s.PeerConnection.WriteRTCP([]rtcp.Packet{&rtcp.PictureLossIndication{MediaSSRC: uint32(remote.SSRC())}})
				if errSend != nil {
					logrus.WithField("error", errSend).Warning("轨道RTCP异常")
				}
				if s.PeerConnection.ConnectionState() == webrtc.PeerConnectionStateClosed {
					break
				}
			}
		}()

		s.LocalTrack = localTrack

		go func() {
			// 循环读取数据包发送给actor消费
			for {
				packet, _, err := remote.ReadRTP()
				if err != nil {
					logrus.WithField("sessionId", s.SessionId).Warning("媒体轨道终止", err)
					return
				}

				err = s.LocalTrack.WriteRTP(packet)
				if err != nil {
					return
				}
			}
		}()
	})

	s.PeerConnection.OnNegotiationNeeded(func() {
		_, _ = s.CreateSDPAndSend(webrtc.SDPTypeOffer)
	})

	s.PeerConnection.OnConnectionStateChange(func(state webrtc.PeerConnectionState) {
		logrus.WithField("sessionId", s.SessionId).WithField("state", state).Info("WebRTC连接状态变化")
		if state == webrtc.PeerConnectionStateDisconnected {
			GlobalSocketServer.LeaveAllRooms(s.SessionId)
		}
	})
}

// HandleRemoteSDPOffer 当接收到远程SDP Offer时，创建应答
func (s *WebRTCSession) HandleRemoteSDPOffer(offer webrtc.SessionDescription) {
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

func (s *WebRTCSession) CreateSDPAndSend(sdpType webrtc.SDPType) (*webrtc.SessionDescription, error) {
	var sessionDescription webrtc.SessionDescription
	var emitEvent string
	var err error

	switch sdpType {
	case webrtc.SDPTypeOffer:
		offer, createErr := s.PeerConnection.CreateOffer(nil)
		sessionDescription = offer
		err = createErr
		emitEvent = "rtc:offer"
	case webrtc.SDPTypeAnswer:
		answer, createErr := s.PeerConnection.CreateAnswer(nil)
		sessionDescription = answer
		err = createErr
		emitEvent = "rtc:answer"
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
	//jsonSDP, _ := json.Marshal(offer)
	_ = GlobalSocketServer.Server.To(socket.Room(s.SessionId)).Emit(emitEvent, RTCAnswer{SDP: offer})

	logrus.
		WithField("type", sdpType).
		WithField("sessionId", s.SessionId).
		Infof("将SDP发送给客户端")

	return offer, err
}
