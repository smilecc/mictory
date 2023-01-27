use actix::prelude::*;
use std::{
    collections::{HashMap, HashSet},
    sync::Arc,
};

use actix::{Actor, Addr, Context, Handler, Message, ResponseFuture, WrapFuture};
use sea_orm::{
    sea_query::Expr, ActiveModelTrait, ColumnTrait, DatabaseConnection, EntityTrait,
    IntoActiveModel, QueryFilter, Set,
};

use crate::{
    engine::{engine::EngineSendWebSocketMessage, rtc::message::RTCRemoveTrackMessage},
    model::{room, room_user},
};

use super::{
    engine::Engine,
    rtc::{
        message::RTCAddTrackMessage,
        session::{LocalTrack, RTCSession},
    },
    websocket::WebSocketSession,
};

#[derive(Debug)]
pub struct Room {
    pub room: Option<room::Model>,
    pub room_id: String,
    pub engine_addr: Addr<Engine>,
    ws_session_addrs: HashMap<String, Addr<WebSocketSession>>,
    rtc_session_addrs: HashMap<String, Addr<RTCSession>>,
    all_tracks: HashSet<LocalTrack>,
    db: Arc<DatabaseConnection>,
}

impl Room {
    pub fn new(room_id: String, engine_addr: Addr<Engine>, db: Arc<DatabaseConnection>) -> Room {
        log::info!("创建房间[ID: {}]", room_id);
        Room {
            room: None,
            room_id,
            engine_addr,
            ws_session_addrs: HashMap::new(),
            rtc_session_addrs: HashMap::new(),
            all_tracks: HashSet::new(),
            db,
        }
    }
}

impl Actor for Room {
    type Context = Context<Self>;

    fn started(&mut self, ctx: &mut Self::Context) {
        ctx.set_mailbox_capacity(64);
        let db = self.db.clone();
        let room_id = self.room_id.clone();

        async move {
            // 创建房间，把该房间号原有在线用户列表清除
            let db_ref = db.as_ref();

            let room = room::Entity::find_by_id(room_id.parse().unwrap())
                .one(db_ref)
                .await
                .unwrap();

            room_user::Entity::update_many()
                .col_expr(room_user::Column::Online, Expr::value(true))
                .filter(room_user::Column::RoomId.eq(room_id))
                .exec(db_ref)
                .await
                .unwrap();

            (room,)
        }
        .into_actor(self)
        .map(|res, act, ctx| {
            // 如果房间在数据库中不存在，则直接停止actor
            if res.0.is_none() {
                log::warn!("Engine房间创建失败，房间[{}]不存在", &act.room_id);
                ctx.stop();
                return;
            }

            act.room = res.0;
        })
        .wait(ctx);
    }
}

// 处理加入房间事件
#[derive(Message)]
#[rtype(result = "()")]
pub struct RoomJoinMessage {
    pub user_id: i64,
    pub session_id: String,
    pub rtc_session_addr: Addr<RTCSession>,
    pub ws_session_addr: Addr<WebSocketSession>,
}

impl Handler<RoomJoinMessage> for Room {
    type Result = ();

    fn handle(&mut self, msg: RoomJoinMessage, ctx: &mut Self::Context) -> Self::Result {
        log::info!("房间[{}]会话加入[{}]", self.room_id, msg.session_id);
        let db = self.db.clone();
        let user_id = msg.user_id.clone();
        let room = self.room.clone().unwrap();
        let session_id = msg.session_id.clone();
        let engine_addr = self.engine_addr.clone();

        async move {
            // 查询用户是否已经加入过该房间
            let room_user_record = room_user::Entity::find()
                .filter(room_user::Column::RoomId.eq(room.id.clone()))
                .filter(room_user::Column::UserId.eq(user_id.clone()))
                .one(db.as_ref())
                .await
                .unwrap();

            let room_user_record = if let Some(record) = room_user_record {
                // 更新在线状态
                let mut update_record = record.clone().into_active_model();
                update_record.online = Set(true);
                update_record.session_id = Set(session_id);
                update_record.update(db.as_ref()).await.unwrap()
            } else {
                // 写入记录
                room_user::ActiveModel {
                    server_id: Set(room.server_id.clone()),
                    room_id: Set(room.id.clone()),
                    user_id: Set(user_id.clone()),
                    session_id: Set(session_id),
                    online: Set(true),
                    ..Default::default()
                }
                .insert(db.as_ref())
                .await
                .unwrap()
            };

            // 查询该服务器所有在线用户
            let room_users = room_user::Entity::find()
                .filter(room_user::Column::ServerId.eq(room.server_id.clone()))
                .all(db.as_ref())
                .await
                .unwrap_or(vec![]);

            // 通知该服务器其他用户，有用户加入
            for notice_room_user in room_users.iter() {
                engine_addr.do_send(EngineSendWebSocketMessage {
                    session_id: notice_room_user.session_id.clone(),
                    event: "server_user_join".to_string(),
                    data: serde_json::to_string(&room_user_record).unwrap(),
                })
            }
        }
        .into_actor(self)
        .map(|_, act, _ctx| {
            // 将已经存在的轨道发送给会话
            msg.rtc_session_addr.do_send(RTCAddTrackMessage {
                source_session_id: msg.session_id.clone(),
                local_tracks: act.all_tracks.clone(),
            });

            // 将会话信息写入房间
            act.rtc_session_addrs
                .insert(msg.session_id.clone(), msg.rtc_session_addr);
            act.ws_session_addrs
                .insert(msg.session_id, msg.ws_session_addr);
        })
        .wait(ctx);
    }
}

// 处理离开房间事件
#[derive(Message)]
#[rtype(result = "()")]
pub struct RoomExitMessage {
    pub session_id: String,
}

impl Handler<RoomExitMessage> for Room {
    type Result = ();

    fn handle(&mut self, msg: RoomExitMessage, ctx: &mut Self::Context) -> Self::Result {
        log::info!("房间[{}]会话退出[{}]", self.room_id, msg.session_id);
        let session_id = msg.session_id.clone();
        let room = self.room.clone().unwrap();
        let db = self.db.clone();
        let engine_addr = self.engine_addr.clone();

        async move {
            // 移除房间用户记录
            let room_user_record = room_user::Entity::find()
                .filter(room_user::Column::SessionId.eq(session_id))
                .filter(room_user::Column::RoomId.eq(room.id.clone()))
                .one(db.as_ref())
                .await
                .unwrap();

            if let Some(record) = room_user_record {
                // 更新状态为下线
                let mut update_record = record.clone().into_active_model();
                update_record.online = Set(false);
                update_record.update(db.as_ref()).await.unwrap();

                // 查询该服务器所有在线用户
                let room_users = room_user::Entity::find()
                    .filter(room_user::Column::ServerId.eq(record.server_id.clone()))
                    .all(db.as_ref())
                    .await
                    .unwrap_or(vec![]);

                // 通知该服务器其他用户，有用户退出
                for notice_room_user in room_users.iter() {
                    engine_addr.do_send(EngineSendWebSocketMessage {
                        session_id: notice_room_user.session_id.clone(),
                        event: "server_user_exit".to_string(),
                        data: serde_json::to_string(&record).unwrap(),
                    })
                }
            }
            (msg,)
        }
        .into_actor(self)
        .map(|res, act, _ctx| {
            act.rtc_session_addrs.remove(&res.0.session_id);
            act.ws_session_addrs.remove(&res.0.session_id);

            // 移除该会话相关轨道
            let mut removed_tracks = act.all_tracks.clone();
            removed_tracks.retain(|t| t.0.session_id == res.0.session_id);

            for (_, session) in act.rtc_session_addrs.iter() {
                session.do_send(RTCRemoveTrackMessage {
                    source_session_id: res.0.session_id.clone(),
                    local_tracks: removed_tracks.clone(),
                })
            }

            act.all_tracks
                .retain(|t| t.0.session_id != res.0.session_id);
        })
        .wait(ctx);
    }
}

#[derive(Message)]
#[rtype(result = "()")]
pub struct RoomNewTrackMessage {
    pub session_id: String,
    pub local_track: LocalTrack,
}

// 当有新轨道时，筛选需要加入的会话，通知加入会话
impl Handler<RoomNewTrackMessage> for Room {
    type Result = ResponseFuture<()>;

    fn handle(&mut self, msg: RoomNewTrackMessage, _: &mut Self::Context) -> Self::Result {
        let rtc_session_addrs = self.rtc_session_addrs.clone();

        // 加入到轨道列表
        self.all_tracks.insert(msg.local_track.clone());

        Box::pin(async move {
            for (current_session_id, rtc_session_addr) in rtc_session_addrs {
                // 如果来源会话和循环当前会话为同一会话，则忽略
                if msg.session_id == current_session_id {
                    continue;
                }

                rtc_session_addr.do_send(RTCAddTrackMessage {
                    source_session_id: msg.session_id.clone(),
                    local_tracks: HashSet::from([msg.local_track.clone()]),
                })
            }
        })
    }
}
