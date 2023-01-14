package engine

import (
	"fmt"
	"github.com/asynkron/protoactor-go/actor"
	"github.com/sirupsen/logrus"
	"golang.org/x/exp/slices"
	"sync"
	"time"
)

var GlobalActorSystem = actor.NewActorSystem()
var GlobalEngine *Engine

//goland:noinspection GoNameStartsWithPackageName
var EnginePID *actor.PID

type Engine struct {
	userSessionsLock  sync.RWMutex
	UserSessions      []*UserSession
	UserSessionPIDMap map[string]*actor.PID

	rtcSessionPIDMapLock sync.RWMutex
	RTCSessionPIDMap     map[string]*actor.PID
}

func (e *Engine) Receive(ctx actor.Context) {
	switch msg := ctx.Message().(type) {
	case TestMessage:
		fmt.Printf("Hello %v\n", msg.Hello)
	case WebSocketConnectMessage:
		// 新Websocket会话连接，创建用户会话结构体并增加到数组中
		session := NewUserSession(msg.Connection)

		// 插入到会话数组
		e.InsertUserSession(session)
		logrus.WithField("SessionId", session.SessionId).Info("新Websocket会话连接")

		// 返回给生产者
		ctx.Respond(session)
	case WebSocketDisconnectMessage:
		// 从数组中移除会话
		e.RemoveUserSession(msg.SessionId)
		e.RemoveRTCSessionPID(msg.SessionId)
	}
}

func NewEngine() *Engine {
	if GlobalEngine != nil {
		return GlobalEngine
	}

	engine := &Engine{
		UserSessionPIDMap: make(map[string]*actor.PID),
		RTCSessionPIDMap:  make(map[string]*actor.PID),
	}
	GlobalEngine = engine
	// 注册actor
	engineProps := actor.PropsFromProducer(func() actor.Actor {
		return engine
	})
	EnginePID = GlobalActorSystem.Root.Spawn(engineProps)

	go func() {
		for {
			time.Sleep(3 * time.Second)
			for _, session := range GlobalEngine.UserSessions {
				if session.RTCSession == nil {
					continue
				}

				for _, session2 := range GlobalEngine.UserSessions {
					if session.SessionId == session2.SessionId ||
						session.RTCSession == nil ||
						session2.RTCSession == nil ||
						session2.RTCSession.LocalTrack == nil {
						continue
					}

					session.RTCSession.PeerConnection.AddTrack(session2.RTCSession.LocalTrack)
				}
			}
		}
	}()

	return engine
}

// InsertUserSession 新增用户会话
func (e *Engine) InsertUserSession(session *UserSession) {
	e.userSessionsLock.Lock()
	e.UserSessions = append(e.UserSessions, session)
	e.UserSessionPIDMap[session.SessionId] = session.SessionPID
	e.userSessionsLock.Unlock()
}

// RemoveUserSession 移除用户会话
func (e *Engine) RemoveUserSession(sessionId string) {
	// 从数组中移除会话
	e.userSessionsLock.Lock()
	defer e.userSessionsLock.Unlock()

	removeIndex := slices.IndexFunc(e.UserSessions, func(session *UserSession) bool {
		return session.SessionId == sessionId
	})

	if removeIndex == -1 {
		return
	}

	session := e.UserSessions[removeIndex]
	e.UserSessions = slices.Delete(e.UserSessions, removeIndex, removeIndex+1)
	delete(e.UserSessionPIDMap, sessionId)

	// 停止actor
	GlobalActorSystem.Root.Stop(session.SessionPID)
}

func (e *Engine) InsertRTCSessionPID(session *RTCSession) {
	e.RTCSessionPIDMap[session.SessionId] = session.PID
}

func (e *Engine) RemoveRTCSessionPID(sessionId string) {
	delete(e.RTCSessionPIDMap, sessionId)
}

func (e *Engine) SendJsonToSession(sessionId string, msg *WebsocketMessage) {
	pid := e.UserSessionPIDMap[sessionId]
	GlobalActorSystem.Root.Send(pid, WebSocketSendMessage{
		Message: msg,
	})
}
