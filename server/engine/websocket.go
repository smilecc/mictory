package engine

import (
	"encoding/json"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/websocket/v2"
	"github.com/pion/webrtc/v3"
	"github.com/sirupsen/logrus"
	"log"
	"time"
)

type WebsocketMessage struct {
	Event string `json:"event"`
	Data  string `json:"data"`
}

type joinRoomEvent struct {
	SDP string `json:"sdp"`
}

type joinRoomAnswer struct {
	SDP       string `json:"sdp"`
	SessionId string `json:"sessionId"`
}

func HandleWebsocket(app *fiber.App) {
	app.Use("/ws", func(c *fiber.Ctx) error {
		if websocket.IsWebSocketUpgrade(c) {
			c.Locals("allowed", true)
			return c.Next()
		}
		return fiber.ErrUpgradeRequired
	})

	app.Get("/ws", websocket.New(func(c *websocket.Conn) {

		// 通知引擎有新连接加入
		session, _ := GlobalActorSystem.Root.RequestFuture(EnginePID, WebSocketConnectMessage{Connection: c}, 30*time.Second).Result()
		if session == nil {
			return
		}

		userSession := session.(*UserSession)

		// 监听会话关闭，通知engine
		c.SetCloseHandler(func(code int, text string) error {
			logrus.WithField("SessionId", userSession.SessionId).Info("SetCloseHandler")
			GlobalActorSystem.Root.Send(EnginePID, WebSocketDisconnectMessage{SessionId: userSession.SessionId})
			return nil
		})

		message := &WebsocketMessage{}
		for {
			err := c.ReadJSON(message)

			if err != nil {
				logrus.Error(err)
				break
			}

			logrus.Info(message)

			switch message.Event {
			case "rtc_join_room":
				var event joinRoomEvent
				_ = json.Unmarshal([]byte(message.Data), &event)

				// 创建RTC会话
				userSession.RTCSession = NewRTCSession(userSession.SessionId)
				userSession.RTCSession.HandleRemoteSDPOffer(event.SDP)

			case "candidate":
				if userSession.RTCSession == nil {
					continue
				}

				candidate := webrtc.ICECandidateInit{}
				if err := json.Unmarshal([]byte(message.Data), &candidate); err != nil {
					log.Println(err)
					return
				}

				if err := userSession.RTCSession.PeerConnection.AddICECandidate(candidate); err != nil {
					log.Println(err)
					return
				}
			case "rtc_answer":
				if userSession.RTCSession == nil {
					continue
				}

				answer := webrtc.SessionDescription{}
				if err := json.Unmarshal([]byte(message.Data), &answer); err != nil {
					log.Println(err)
					return
				}

				if err := userSession.RTCSession.PeerConnection.SetRemoteDescription(answer); err != nil {
					log.Println(err)
					return
				}
			}
		}
	}))
}
