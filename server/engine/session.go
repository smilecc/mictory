package engine

import (
	"github.com/asynkron/protoactor-go/actor"
	"github.com/gofiber/websocket/v2"
	nanoid "github.com/matoous/go-nanoid/v2"
	"github.com/sirupsen/logrus"
)

type UserSession struct {
	SessionId     string
	WebsocketConn *websocket.Conn
	SessionPID    *actor.PID
	RTCSession    *RTCSession
}

func NewUserSession(websocketConn *websocket.Conn) *UserSession {
	sessionId, _ := nanoid.New()
	session := &UserSession{
		SessionId:     sessionId,
		WebsocketConn: websocketConn,
	}

	// 注册actor
	sessionProps := actor.PropsFromProducer(func() actor.Actor {
		return session
	})
	session.SessionPID = GlobalActorSystem.Root.Spawn(sessionProps)

	return session
}

func (u *UserSession) Receive(ctx actor.Context) {
	switch msg := ctx.Message().(type) {
	case WebSocketSendMessage:
		_ = u.WebsocketConn.WriteJSON(msg.Message)
	case *actor.Stopped:
		if u.RTCSession != nil {
			GlobalActorSystem.Root.Stop(u.RTCSession.PID)
		}
		logrus.WithField("SessionId", u.SessionId).Info("会话Actor停止")
	}
}
