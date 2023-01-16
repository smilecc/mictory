use std::collections::HashMap;

use actix::prelude::*;

use crate::engine::{
    room::{RoomExitMessage, RoomJoinMessage},
    rtc::message::RTCStopMessage,
};

use super::{room::Room, rtc::session::RTCSession, websocket::WebSocketSession};

#[derive(Debug)]
pub struct Engine {
    pub ws_message_addrs: HashMap<String, Addr<WebSocketSession>>,
    pub rtc_session_addrs: HashMap<String, Addr<RTCSession>>,
    room_addrs: HashMap<String, Addr<Room>>,
    session_room_map: HashMap<String, String>,
}

impl Engine {
    pub fn new() -> Self {
        Engine {
            ws_message_addrs: HashMap::new(),
            rtc_session_addrs: HashMap::new(),
            room_addrs: HashMap::new(),
            session_room_map: HashMap::new(),
        }
    }
}

impl Actor for Engine {
    type Context = Context<Self>;

    fn started(&mut self, ctx: &mut Self::Context) {
        ctx.set_mailbox_capacity(1024);
    }
}

#[derive(Debug)]
pub struct EngineJoinRoomMessageResult {
    pub room_id: String,
    pub session_id: String,
    pub rtc_session_addr: Addr<RTCSession>,
}

#[derive(Message, Debug)]
#[rtype(EngineJoinRoomMessageResult)]
pub struct EngineJoinRoomMessage {
    pub room_id: String,
    pub session_id: String,
    pub ws_addr: Addr<WebSocketSession>,
}

// 处理会话加入房间
impl Handler<EngineJoinRoomMessage> for Engine {
    type Result = ResponseActFuture<Self, EngineJoinRoomMessageResult>;

    fn handle(&mut self, msg: EngineJoinRoomMessage, ctx: &mut Self::Context) -> Self::Result {
        let room_id = msg.room_id.clone();
        let session_id = msg.session_id.clone();
        let ws_addr = msg.ws_addr.clone();
        let engine_addr = ctx.address();

        // 如果会话已经在另外一个房间，则从房间退出
        if let Some(room_id) = self.session_room_map.get(&session_id) {
            if let Some(room_addr) = self.room_addrs.get(room_id) {
                room_addr.do_send(RoomExitMessage {
                    session_id: session_id.clone(),
                });
            }
            self.session_room_map.remove(&session_id);
        }

        // 获取房间实体，如果房间不存在，则创建一个房间
        self.session_room_map
            .insert(session_id.clone(), room_id.clone());
        let room_addr = if let Some(room_addr) = self.room_addrs.get(&room_id) {
            room_addr.clone()
        } else {
            let room_addr = Room::new(room_id.clone(), ctx.address()).start();
            self.room_addrs.insert(room_id.clone(), room_addr.clone());
            room_addr
        };

        log::info!("Engine处理会话加入房间: {msg:?}");

        Box::pin(
            async move {
                // 创建RTC会话和连接
                let rtc_session_addr = RTCSession::new(
                    engine_addr.clone(),
                    ws_addr.clone(),
                    session_id.clone(),
                    room_id.clone(),
                    room_addr.clone(),
                )
                .await
                .unwrap()
                .start();

                // 通知房间新会话加入
                room_addr.do_send(RoomJoinMessage {
                    session_id: session_id.clone(),
                    rtc_session_addr: rtc_session_addr.clone(),
                    ws_session_addr: ws_addr.clone(),
                });

                EngineJoinRoomMessageResult {
                    room_id,
                    session_id: msg.session_id,
                    rtc_session_addr,
                }
            }
            .into_actor(self)
            .map(|res, act, _ctx| {
                // 写入到当前actor
                act.ws_message_addrs
                    .insert(res.session_id.clone(), msg.ws_addr);
                act.rtc_session_addrs
                    .insert(res.session_id.clone(), res.rtc_session_addr.clone());
                res
            }),
        )
    }
}

#[derive(Message)]
#[rtype(result = "()")]
pub struct WebSocketDisconnectMessage {
    pub session_id: String,
}

// 处理Websocket连接断开
impl Handler<WebSocketDisconnectMessage> for Engine {
    type Result = ();

    fn handle(&mut self, msg: WebSocketDisconnectMessage, _: &mut Self::Context) -> Self::Result {
        log::info!("WebSocket会话断开，会话ID：{}", &msg.session_id);
        self.ws_message_addrs.remove(&msg.session_id);

        // 通知房间会话退出
        if let Some(room_id) = self.session_room_map.get(&msg.session_id) {
            if let Some(room_addr) = self.room_addrs.get(room_id) {
                room_addr.do_send(RoomExitMessage {
                    session_id: msg.session_id.clone(),
                })
            }
        }

        // 关闭RTC会话
        if let Some(rtc_addr) = self.rtc_session_addrs.get(&msg.session_id) {
            rtc_addr.do_send(RTCStopMessage {});
        }
        self.rtc_session_addrs.remove(&msg.session_id);
    }
}
