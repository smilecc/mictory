use std::collections::{HashMap, HashSet};

use actix::{Actor, Addr, Context, Handler, Message, ResponseFuture};

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
    pub room_id: String,
    engine_addr: Addr<Engine>,
    ws_session_addrs: HashMap<String, Addr<WebSocketSession>>,
    rtc_session_addrs: HashMap<String, Addr<RTCSession>>,
    all_tracks: HashSet<LocalTrack>,
}

impl Room {
    pub fn new(room_id: String, engine_addr: Addr<Engine>) -> Room {
        log::info!("创建房间[ID: {}]", room_id);
        Room {
            room_id,
            engine_addr,
            ws_session_addrs: HashMap::new(),
            rtc_session_addrs: HashMap::new(),
            all_tracks: HashSet::new(),
        }
    }
}

impl Actor for Room {
    type Context = Context<Self>;

    fn started(&mut self, ctx: &mut Self::Context) {
        ctx.set_mailbox_capacity(64);
    }
}

// 处理加入房间事件
#[derive(Message)]
#[rtype(result = "()")]
pub struct RoomJoinMessage {
    pub session_id: String,
    pub rtc_session_addr: Addr<RTCSession>,
    pub ws_session_addr: Addr<WebSocketSession>,
}

impl Handler<RoomJoinMessage> for Room {
    type Result = ();

    fn handle(&mut self, msg: RoomJoinMessage, _ctx: &mut Self::Context) -> Self::Result {
        log::info!("房间[{}]会话加入[{}]", self.room_id, msg.session_id);
        // 将已经存在的轨道发送给会话
        msg.rtc_session_addr.do_send(RTCAddTrackMessage {
            source_session_id: msg.session_id.clone(),
            local_tracks: self.all_tracks.clone(),
        });

        // 将会话信息写入房间
        self.rtc_session_addrs
            .insert(msg.session_id.clone(), msg.rtc_session_addr);
        self.ws_session_addrs
            .insert(msg.session_id, msg.ws_session_addr);
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

    fn handle(&mut self, msg: RoomExitMessage, _ctx: &mut Self::Context) -> Self::Result {
        log::info!("房间[{}]会话退出[{}]", self.room_id, msg.session_id);
        self.rtc_session_addrs.remove(&msg.session_id);
        self.ws_session_addrs.remove(&msg.session_id);

        // 移除该会话相关轨道
        self.all_tracks.retain(|t| t.0.session_id != msg.session_id);
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
