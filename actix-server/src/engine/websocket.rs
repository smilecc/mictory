use std::sync::Arc;

use actix::{
    fut, Actor, ActorContext, ActorFutureExt, Addr, AsyncContext, ContextFutureSpawner, Handler,
    Message, StreamHandler, WrapFuture,
};
use actix_web_actors::ws::{self, ProtocolError};
use jwt_simple::prelude::{HS512Key, MACLike};
use migration::Expr;
use nanoid::nanoid;
use sea_orm::{ColumnTrait, DatabaseConnection, EntityTrait, QueryFilter};
use serde::{Deserialize, Serialize};
use serde_json::{json, Value};
use webrtc::{
    ice_transport::ice_candidate::RTCIceCandidateInit,
    peer_connection::sdp::session_description::RTCSessionDescription,
};

use crate::{
    api::middleware::JWTAuthClaims,
    engine::{
        engine,
        rtc::message::{RTCCandidateMessage, RTCReceiveAnswerMessage, RTCReceiveOfferMessage},
    },
};

use super::{engine::EngineSendWebSocketMessage, rtc::session::RTCSession};
use model::{room_user, user};

#[derive(Debug, Message, Serialize, Deserialize)]
#[rtype(result = "Option<()>")]
pub struct WebSocketSendMessage {
    pub event: String,
    pub data: String,
}

#[derive(Debug, Message, Serialize, Deserialize)]
#[rtype(result = "Option<()>")]
pub struct WebSocketMessage {
    pub event: String,
    pub data: String,
}

#[derive(Debug)]
pub struct WebSocketSession {
    pub session_id: String,
    pub engine_addr: Addr<engine::Engine>,
    pub rtc_session_addr: Option<Addr<RTCSession>>,
    pub jwt_key: HS512Key,
    pub user_id: Option<i64>,
    pub db: Arc<DatabaseConnection>,
}

impl WebSocketSession {
    pub fn new(
        engine_addr: Addr<engine::Engine>,
        jwt_key: HS512Key,
        db: Arc<DatabaseConnection>,
    ) -> Self {
        WebSocketSession {
            session_id: nanoid!(),
            engine_addr,
            rtc_session_addr: None,
            jwt_key,
            user_id: None,
            db,
        }
    }
}

impl Actor for WebSocketSession {
    type Context = ws::WebsocketContext<Self>;

    fn started(&mut self, ctx: &mut Self::Context) {
        ctx.set_mailbox_capacity(64);
        self.session_id = nanoid!();
    }

    fn stopped(&mut self, _ctx: &mut Self::Context) {
        log::info!("WebSocketSession?????????{}", self.session_id);
        self.engine_addr.do_send(engine::EngineExitRoomMessage {
            session_id: self.session_id.clone(),
            user_id: self.user_id.clone(),
            is_ws_disconnect: true,
        });
    }
}

// ??????Websocket???????????????
impl StreamHandler<Result<actix_web_actors::ws::Message, ProtocolError>> for WebSocketSession {
    fn handle(
        &mut self,
        msg: Result<actix_web_actors::ws::Message, ProtocolError>,
        ctx: &mut Self::Context,
    ) {
        match msg {
            Ok(ws::Message::Text(text)) => {
                if let Ok(v) = serde_json::from_str::<WebSocketMessage>(&text) {
                    // println!("???????????? {v:?}");
                    ctx.address().do_send(v);
                }
            }
            Ok(ws::Message::Close(_reason)) => {
                // ???????????????????????????????????????????????????Engine
                ctx.stop();
            }
            _ => {
                log::info!("??????WebSocket Message: {msg:?}");
            }
        }
    }
}

// ?????????????????????WebSocket??????
impl Handler<WebSocketMessage> for WebSocketSession {
    type Result = Option<()>;

    fn handle(&mut self, msg: WebSocketMessage, ctx: &mut Self::Context) -> Self::Result {
        let address = ctx.address();
        let engine_addr = self.engine_addr.clone();
        // log::info!("WebSocket Message: {}", msg.event);

        // ??????????????????????????????auth??????
        if msg.event != "auth" && self.user_id.is_none() {
            return None;
        }

        match msg.event.as_str() {
            "auth" => {
                if let Ok(claims) = self.jwt_key.verify_token::<JWTAuthClaims>(&msg.data, None) {
                    log::debug!("WebSocket?????????????????????UserId: {}", claims.custom.user_id);
                    let user_id = claims.custom.user_id.clone();
                    self.user_id = Some(user_id.clone());
                    let db = self.db.clone();

                    // ????????????????????????
                    async move {
                        user::Entity::update_many()
                            .filter(user::Column::Id.eq(user_id.clone()))
                            .col_expr(user::Column::SessionOnline, Expr::value(true))
                            .exec(db.as_ref())
                            .await
                            .unwrap();
                    }
                    .into_actor(self)
                    .wait(ctx);

                    // ?????????????????????ID
                    let new_session_data = &json!({
                        "sessionId": self.session_id.clone(),
                    });

                    if let Ok(msg_data_json) = serde_json::to_string(&new_session_data) {
                        if let Ok(msg_json) = serde_json::to_string(&WebSocketSendMessage {
                            event: "new_session".to_owned(),
                            data: msg_data_json,
                        }) {
                            ctx.text(msg_json);
                        }
                    }
                }
            }
            "rtc_join_room" => {
                log::debug!("rtc_join_room");

                let data = msg.data.clone();
                let data_json: Value = serde_json::from_str(&data).unwrap_or(Value::Null);
                let room_id = data_json["roomId"].as_str().unwrap_or("").to_string();
                let session_id = self.session_id.clone();
                let user_id = self.user_id.clone().unwrap();
                let db = self.db.clone();

                async move {
                    // ???????????????????????????
                    let user_sessions = room_user::Entity::find()
                        .filter(room_user::Column::UserId.eq(user_id.clone()))
                        .all(db.as_ref())
                        .await
                        .unwrap();

                    for user_session in user_sessions.iter() {
                        engine_addr
                            .send(engine::EngineExitRoomMessage {
                                is_ws_disconnect: false,
                                user_id: None,
                                session_id: user_session.session_id.clone(),
                            })
                            .await
                            .unwrap_or_default();
                    }

                    // ??????Engine????????????????????????
                    let connect_res = engine_addr
                        .send(engine::EngineJoinRoomMessage {
                            user_id,
                            room_id: room_id.to_string(),
                            session_id,
                            ws_addr: address.clone(),
                        })
                        .await;

                    if connect_res.is_ok() {
                        let rtc_session_addr =
                            connect_res.as_ref().unwrap().rtc_session_addr.clone();

                        if let Some(sdp) = data_json.get("sdp") {
                            rtc_session_addr
                                .send(RTCReceiveOfferMessage {
                                    sdp: sdp.as_str().unwrap().to_owned(),
                                })
                                .await
                                .unwrap_or_default();
                        }
                    }

                    connect_res
                }
                .into_actor(self)
                .then(|res, act, ctx| {
                    // ???Engine???????????????ID??????????????????
                    match res {
                        Ok(res) => {
                            act.session_id = res.session_id;
                            act.rtc_session_addr = Some(res.rtc_session_addr);
                        }
                        _ => ctx.stop(),
                    }
                    fut::ready(())
                })
                .wait(ctx);
            }
            "rtc_exit_room" => {
                log::info!("RTC???????????????{}", self.session_id);
                self.engine_addr.do_send(engine::EngineExitRoomMessage {
                    session_id: self.session_id.clone(),
                    user_id: None,
                    is_ws_disconnect: false,
                });
            }
            "candidate" => {
                let rtc_addr = self.rtc_session_addr.as_mut()?;
                let candidate = msg.data.clone();
                rtc_addr.do_send(RTCCandidateMessage {
                    candidate: RTCIceCandidateInit {
                        candidate,
                        ..Default::default()
                    },
                });
            }
            "rtc_answer" => {
                let rtc_addr = self.rtc_session_addr.as_mut()?;
                let answer = match serde_json::from_str::<RTCSessionDescription>(&msg.data) {
                    Ok(a) => a,
                    Err(err) => {
                        log::error!("{}", err);
                        return None;
                    }
                };

                rtc_addr.do_send(RTCReceiveAnswerMessage { sdp: answer });
            }
            "server_notify" => {
                let db = self.db.clone();
                let data = msg.data.clone();
                let data_json: Value = serde_json::from_str(&data).unwrap_or(Value::Null);
                let server_id = data_json["serverId"].as_i64().unwrap_or(0);
                let engine_addr = self.engine_addr.clone();

                log::debug!(
                    "WebSocket??????server_notify???UserId: {}, ServerId: {}, Data: {}",
                    self.user_id.unwrap_or(0),
                    server_id,
                    msg.data
                );

                async move {
                    // ??????????????????????????????????????????????????????????????????
                    let server_users = room_user::Entity::find()
                        .filter(room_user::Column::ServerId.eq(server_id.clone()))
                        .all(db.as_ref())
                        .await
                        .unwrap_or(vec![]);

                    // ????????????????????????????????????????????????
                    for server_user in server_users.iter() {
                        engine_addr.do_send(EngineSendWebSocketMessage {
                            session_id: server_user.session_id.clone(),
                            event: msg.event.clone(),
                            data: msg.data.clone(),
                        })
                    }
                }
                .into_actor(self)
                .wait(ctx);
            }
            "close" => {
                ctx.stop();
            }
            _ => return None,
        }

        return None;
    }
}

impl Handler<WebSocketSendMessage> for WebSocketSession {
    type Result = Option<()>;

    fn handle(&mut self, msg: WebSocketSendMessage, ctx: &mut Self::Context) -> Self::Result {
        if let Ok(msg_json) = serde_json::to_string(&msg) {
            ctx.text(msg_json);
            Some(())
        } else {
            None
        }
    }
}
