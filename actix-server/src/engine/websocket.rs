use actix::{
    fut, Actor, ActorContext, ActorFutureExt, Addr, AsyncContext, ContextFutureSpawner, Handler,
    Message, StreamHandler, WrapFuture,
};
use actix_web_actors::ws::{self, ProtocolError};
use nanoid::nanoid;
use serde::{Deserialize, Serialize};
use serde_json::{json, Value};
use webrtc::{
    ice_transport::ice_candidate::RTCIceCandidateInit,
    peer_connection::sdp::session_description::RTCSessionDescription,
};

use crate::engine::{
    engine,
    rtc::message::{RTCCandidateMessage, RTCReceiveAnswerMessage, RTCReceiveOfferMessage},
};

use super::rtc::session::RTCSession;

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
}

impl Actor for WebSocketSession {
    type Context = ws::WebsocketContext<Self>;

    fn started(&mut self, ctx: &mut Self::Context) {
        ctx.set_mailbox_capacity(64);
        let session_id = nanoid!();
        self.session_id = session_id.clone();

        let new_session_data = &json!({
            "sessionId": session_id,
        });

        let new_session_data_json = if let Ok(msg_json) = serde_json::to_string(&new_session_data) {
            msg_json
        } else {
            return;
        };

        if let Ok(msg_json) = serde_json::to_string(&WebSocketSendMessage {
            event: "new_session".to_owned(),
            data: new_session_data_json,
        }) {
            ctx.text(msg_json);
        }
    }

    fn stopped(&mut self, _ctx: &mut Self::Context) {
        log::info!("WebSocketSession终止，{}", self.session_id)
    }
}

// 实现Websocket的消息处理
impl StreamHandler<Result<actix_web_actors::ws::Message, ProtocolError>> for WebSocketSession {
    fn handle(
        &mut self,
        msg: Result<actix_web_actors::ws::Message, ProtocolError>,
        ctx: &mut Self::Context,
    ) {
        // log::info!("WebSocket Message: {msg:?}");

        match msg {
            Ok(ws::Message::Text(text)) => {
                if let Ok(v) = serde_json::from_str::<WebSocketMessage>(&text) {
                    // println!("收到消息 {v:?}");
                    ctx.address().do_send(v);
                }
            }
            Ok(ws::Message::Close(reason)) => {
                // 客户端通知关闭连接，关闭连接并通知Engine
                ctx.close(reason);
                self.engine_addr
                    .do_send(engine::WebSocketDisconnectMessage {
                        session_id: self.session_id.clone(),
                    });
                ctx.stop();
            }
            _ => ctx.stop(),
        }
    }
}

// 监听外部发送的WebSocket消息
impl Handler<WebSocketMessage> for WebSocketSession {
    type Result = Option<()>;

    fn handle(&mut self, msg: WebSocketMessage, ctx: &mut Self::Context) -> Self::Result {
        let address = ctx.address();
        let engine_addr = self.engine_addr.clone();
        log::info!("WebSocket Message: {}", msg.event);

        match msg.event.as_str() {
            "rtc_join_room" => {
                let data = msg.data.clone();
                let data_json: Value = serde_json::from_str(&data).unwrap_or(Value::Null);
                let room_id = data_json["roomId"].as_str().unwrap_or("").to_string();
                let session_id = self.session_id.clone();

                async move {
                    // 通知Engine有新会话加入房间
                    let connect_res = engine_addr
                        .send(engine::EngineJoinRoomMessage {
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
                    // 将Engine分配的会话ID写入当前会话
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

                // // 发送消息给Engine，告知websocket链接创建
                // self.engine_addr
                //     .send(engine::WebSocketConnectMessage {
                //         ws_message_subscriber: address.recipient(),
                //     })
                //     .into_actor(self)
                //     .then(|res, act, ctx| {
                //         // 将Engine分配的会话ID写入当前会话
                //         match res {
                //             Ok(res) => {
                //                 act.session_id = res.session_id;
                //                 act.rtc_session_addr = Some(res.rtc_session_addr);
                //             }
                //             _ => ctx.stop(),
                //         }
                //         fut::ready(())
                //     })
                //     .wait(ctx);
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
