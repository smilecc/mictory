package business

import (
	"fmt"
	"github.com/pion/interceptor"
	"github.com/pion/rtcp"
	"github.com/pion/webrtc/v3"
	"github.com/sirupsen/logrus"
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
			logrus.WithField("SessionId", s.SessionId).Error("创建本地Track失败", err)
			return
		}

		// 定时反馈丢包情况
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

		go func() {
			// 循环读取数据包发送给actor消费
			for {
				packet, _, err := remote.ReadRTP()
				if err != nil {
					logrus.WithField("SessionId", s.SessionId).Warning("媒体轨道终止", err)
					return
				}

				err = s.LocalTrack.WriteRTP(packet)
				if err != nil {
					return
				}
			}
		}()
	})
}
