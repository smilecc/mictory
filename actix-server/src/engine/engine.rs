use std::{collections::HashMap, sync::Arc};

use actix::prelude::*;
use sea_orm::{sea_query::Expr, DatabaseConnection, EntityTrait};

use crate::{
    engine::{
        room::{RoomExitMessage, RoomJoinMessage},
        rtc::message::RTCStopMessage,
        websocket::WebSocketSendMessage,
    },
    model::room_user,
};

use super::{room::Room, rtc::session::RTCSession, websocket::WebSocketSession};

#[derive(Debug)]
pub struct Engine {
    pub ws_message_addrs: HashMap<String, Addr<WebSocketSession>>,
    pub rtc_session_addrs: HashMap<String, Addr<RTCSession>>,
    room_addrs: HashMap<String, Addr<Room>>,
    session_room_map: HashMap<String, String>,
    db: Arc<DatabaseConnection>,
}

impl Engine {
    pub fn new(db: Arc<DatabaseConnection>) -> Self {
        Engine {
            ws_message_addrs: HashMap::new(),
            rtc_session_addrs: HashMap::new(),
            room_addrs: HashMap::new(),
            session_room_map: HashMap::new(),
            db,
        }
    }
}

impl Actor for Engine {
    type Context = Context<Self>;

    fn started(&mut self, ctx: &mut Self::Context) {
        ctx.set_mailbox_capacity(1024);
        let db = self.db.clone();

        ctx.wait(
            async move {
                log::info!("Engine启动，清除全部在线记录（room_user）");
                room_user::Entity::update_many()
                    .col_expr(room_user::Column::Online, Expr::value(false))
                    .exec(db.as_ref())
                    .await
                    .unwrap();
            }
            .into_actor(self),
        );
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
    pub user_id: i64,
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
        let user_id = msg.user_id.clone();
        let ws_addr = msg.ws_addr.clone();
        let engine_addr = ctx.address();
        let db = self.db.clone();

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
            let room_addr = Room::new(room_id.clone(), ctx.address(), db).start();
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
                    user_id: user_id.clone(),
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
pub struct EngineExitRoomMessage {
    pub session_id: String,
    pub is_ws_disconnect: bool,
}

// 处理退出房间
impl Handler<EngineExitRoomMessage> for Engine {
    type Result = ();

    fn handle(&mut self, msg: EngineExitRoomMessage, _: &mut Self::Context) -> Self::Result {
        log::info!("处理退出房间，会话ID：{}", &msg.session_id);
        // 只有Websocket连接断开才从列表中移除
        if msg.is_ws_disconnect {
            self.ws_message_addrs.remove(&msg.session_id);
        }

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

#[derive(Message)]
#[rtype(result = "()")]
pub struct EngineSendWebSocketMessage {
    pub session_id: String,
    pub event: String,
    pub data: String,
}

// 给目标会话发送WebSocket消息
impl Handler<EngineSendWebSocketMessage> for Engine {
    type Result = ();

    fn handle(&mut self, msg: EngineSendWebSocketMessage, _: &mut Self::Context) -> Self::Result {
        log::info!("发送WebSocket消息，会话ID：{}", &msg.session_id);
        if let Some(ws_addr) = self.ws_message_addrs.get(&msg.session_id) {
            ws_addr.do_send(WebSocketSendMessage {
                event: msg.event.clone(),
                data: msg.data.clone(),
            })
        }
    }
}
