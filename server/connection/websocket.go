package connection

import (
	"encoding/json"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/websocket/v2"
	"github.com/pion/webrtc/v3"
	"log"
	"sync"
)

var (
	// lock for peerConnections and trackLocals
	listLock        sync.RWMutex
	peerConnections []peerConnectionState
	trackLocals     map[string]*webrtc.TrackLocalStaticRTP
)

type websocketMessage struct {
	Event string `json:"event"`
	Data  string `json:"data"`
}

type peerConnectionState struct {
	peerConnection *webrtc.PeerConnection
	websocket      *websocket.Conn
}

func HandleWebsocket(app *fiber.App) {
	app.Use("/ws", func(c *fiber.Ctx) error {
		if websocket.IsWebSocketUpgrade(c) {
			c.Locals("allowed", true)
			return c.Next()
		}
		return fiber.ErrUpgradeRequired
	})

	app.Get("/ws/connect", websocket.New(func(c *websocket.Conn) {

		// 创建WebRTC对等连接
		peerConnection, err := webrtc.NewPeerConnection(webrtc.Configuration{})
		if err != nil {
			log.Print(err)
			return
		}

		// ws连接结束时关闭RTC连接
		defer peerConnection.Close()

		// 接收音轨输入
		for _, typ := range []webrtc.RTPCodecType{webrtc.RTPCodecTypeAudio} {
			if _, err := peerConnection.AddTransceiverFromKind(typ, webrtc.RTPTransceiverInit{
				Direction: webrtc.RTPTransceiverDirectionRecvonly,
			}); err != nil {
				log.Print(err)
				return
			}
		}

		// 将连接加入全局列表
		listLock.Lock()
		peerConnections = append(peerConnections, peerConnectionState{peerConnection, c})
		listLock.Unlock()

		/**
		Trickle ICE. Emit server candidate to client
		通知客户端有新的candidate（端对端候选者）
		*/
		peerConnection.OnICECandidate(func(i *webrtc.ICECandidate) {
			if i == nil {
				return
			}

			candidateString, err := json.Marshal(i.ToJSON())
			if err != nil {
				log.Println(err)
				return
			}

			if writeErr := c.WriteJSON(&websocketMessage{
				Event: "candidate",
				Data:  string(candidateString),
			}); writeErr != nil {
				log.Println(writeErr)
			}
		})

		/**
		当RTC对等连接关闭时，把它从全局列表中移除
		*/
		peerConnection.OnConnectionStateChange(func(p webrtc.PeerConnectionState) {
			switch p {
			case webrtc.PeerConnectionStateFailed:
				if err := peerConnection.Close(); err != nil {
					log.Print(err)
				}
			case webrtc.PeerConnectionStateClosed:
				signalPeerConnections()
			}
		})

		peerConnection.OnTrack(func(t *webrtc.TrackRemote, _ *webrtc.RTPReceiver) {
			// Create a track to fan out our incoming video to all peers
			trackLocal := addTrack(t)
			defer removeTrack(trackLocal)

			buf := make([]byte, 1500)
			for {
				i, _, err := t.Read(buf)
				if err != nil {
					return
				}

				if _, err = trackLocal.Write(buf[:i]); err != nil {
					return
				}
			}
		})

		// Signal for the new PeerConnection
		signalPeerConnections()

		message := &websocketMessage{}
		for {
			_, raw, err := c.ReadMessage()
			if err != nil {
				log.Println(err)
				return
			} else if err := json.Unmarshal(raw, &message); err != nil {
				log.Println(err)
				return
			}

			switch message.Event {
			case "candidate":
				candidate := webrtc.ICECandidateInit{}
				if err := json.Unmarshal([]byte(message.Data), &candidate); err != nil {
					log.Println(err)
					return
				}

				if err := peerConnection.AddICECandidate(candidate); err != nil {
					log.Println(err)
					return
				}
			case "answer":
				answer := webrtc.SessionDescription{}
				if err := json.Unmarshal([]byte(message.Data), &answer); err != nil {
					log.Println(err)
					return
				}

				if err := peerConnection.SetRemoteDescription(answer); err != nil {
					log.Println(err)
					return
				}
			}
		}
	}))
}
