use std::{cell::RefCell, env::consts::OS, sync::Arc, time::Duration};

use by_address::ByAddress;
use nanoid::nanoid;
use serde_json::json;
use tokio::sync::Mutex;
use webrtc::{
    api::{
        media_engine::{MediaEngine, MIME_TYPE_OPUS},
        APIBuilder,
    },
    ice::network_type::NetworkType,
    interceptor::registry::Registry,
    peer_connection::{
        configuration::RTCConfiguration, peer_connection_state::RTCPeerConnectionState,
        sdp::sdp_type::RTCSdpType, RTCPeerConnection,
    },
    rtp_transceiver::{
        rtp_codec::{RTCRtpCodecCapability, RTCRtpCodecParameters, RTPCodecType},
        rtp_sender::RTCRtpSender,
    },
    track::track_local::{track_local_static_rtp::TrackLocalStaticRTP, TrackLocalWriter},
};

use actix::prelude::*;

use crate::engine::{
    engine::{Engine, EngineExitRoomMessage},
    room::{Room, RoomNewTrackMessage},
    websocket::{WebSocketSendMessage, WebSocketSession},
};

pub type LocalTrack = ByAddress<Arc<RTCLocalTrack>>;
pub type ArcLocalTrack = Arc<Mutex<RefCell<ValueWrapper<Option<LocalTrack>>>>>;

#[derive(Debug)]
pub struct RTCLocalTrack {
    pub track_id: String,
    pub session_id: String,
    pub track: Arc<TrackLocalStaticRTP>,
    pub sender: Arc<Mutex<RefCell<ValueWrapper<Option<Arc<RTCRtpSender>>>>>>,
}

#[derive(Debug)]
pub struct RTCSession {
    pub session_id: String,
    pub room_id: String,
    pub peer_connection: Arc<RTCPeerConnection>,
    pub local_track: ArcLocalTrack,
    pub ws_addr: Addr<WebSocketSession>,
    pub engine_addr: Addr<Engine>,
    pub room_addr: Addr<Room>,
    peer_connection_stopped: bool,
}

#[derive(Debug)]
pub struct ValueWrapper<T>(pub T);

impl<T> ValueWrapper<T> {
    pub fn set(&mut self, t: T) {
        self.0 = t;
    }
}

impl RTCSession {
    pub async fn new(
        engine_addr: Addr<Engine>,
        ws_addr: Addr<WebSocketSession>,
        session_id: String,
        room_id: String,
        room_addr: Addr<Room>,
    ) -> Option<Self> {
        match Self::create_peer_connection().await {
            Ok(peer_connection) => {
                log::info!("RTC对等连接创建完毕，会话ID: {}", session_id);

                let session = RTCSession {
                    session_id,
                    room_id,
                    peer_connection,
                    local_track: Arc::new(Mutex::new(RefCell::new(ValueWrapper { 0: None }))),
                    ws_addr,
                    engine_addr,
                    room_addr,
                    peer_connection_stopped: false,
                };

                session.start_handle_rtc_event();
                return Some(session);
            }
            Err(_) => return None,
        }
    }

    // 创建RTC对等连接
    async fn create_peer_connection() -> Result<Arc<RTCPeerConnection>, webrtc::Error> {
        // 创建RTC基础配置
        let mut setting_engine = webrtc::api::setting_engine::SettingEngine::default();
        setting_engine.set_lite(true);
        setting_engine.set_ice_timeouts(
            Some(Duration::from_secs(10)),
            Some(Duration::from_secs(30)),
            Some(Duration::from_secs(2)),
        );
        // 指定网卡设备
        setting_engine.set_interface_filter(Box::new(|x| {
            if OS == "windows" {
                x == "以太网"
            } else {
                x == "eth0"
            }
        }));
        setting_engine.set_network_types(vec![NetworkType::Udp4, NetworkType::Tcp4]);
        // setting_engine
        //     .set_nat_1to1_ips(vec!["192.168.123.2".to_owned()], RTCIceCandidateType::Host);
        setting_engine.set_receive_mtu(8192);

        // 创建RTC媒体编码配置
        let mut media_engine = MediaEngine::default();
        media_engine.register_codec(
            RTCRtpCodecParameters {
                capability: RTCRtpCodecCapability {
                    mime_type: MIME_TYPE_OPUS.to_owned(),
                    clock_rate: 48000,
                    channels: 2,
                    sdp_fmtp_line: "minptime=10;useinbandfec=1".to_owned(),
                    rtcp_feedback: vec![],
                },
                payload_type: 111,
                ..Default::default()
            },
            RTPCodecType::Audio,
        )?;

        // 创建拦截器注册表
        let registry = Registry::new();

        let api = APIBuilder::new()
            .with_media_engine(media_engine)
            .with_setting_engine(setting_engine)
            .with_interceptor_registry(registry)
            .build();

        let config = RTCConfiguration {
            // ice_servers: vec![RTCIceServer {
            //     urls: vec!["stun:stun.l.google.com:19302".to_owned()],
            //     ..Default::default()
            // }],
            bundle_policy:
                webrtc::peer_connection::policy::bundle_policy::RTCBundlePolicy::MaxBundle,
            rtcp_mux_policy:
                webrtc::peer_connection::policy::rtcp_mux_policy::RTCRtcpMuxPolicy::Require,
            ..Default::default()
        };

        let peer_connection = Arc::new(api.new_peer_connection(config).await?);

        Ok(peer_connection)
    }

    pub fn start_handle_rtc_event(&self) {
        let peer_connection = self.peer_connection.clone();
        // let peer_connection_clone = peer_connection.clone();

        let session_id = self.session_id.clone();
        let local_track = self.local_track.clone();
        let room_addr = self.room_addr.clone();

        peer_connection.on_track(Box::new(move |track, _| {
            let session_id_ontrack = session_id.clone();
            let local_track_ontrack = local_track.clone();
            let room_addr_ontrack = room_addr.clone();

            Box::pin(async move {
                if let Some(remote_track) = track {
                    // 创建本地track
                    let track_id = nanoid!();
                    let local_track = TrackLocalStaticRTP::new(
                        remote_track.codec().await.capability,
                        track_id.clone(),
                        nanoid!(),
                    );

                    let local_track_arc = Arc::new(local_track);
                    let local_track_arc_read = local_track_arc.clone();

                    let local_track_byaddr = ByAddress(Arc::new(RTCLocalTrack {
                        track_id: track_id.clone(),
                        session_id: session_id_ontrack.clone(),
                        track: local_track_arc.clone(),
                        sender: Arc::new(Mutex::new(RefCell::new(ValueWrapper(None)))),
                    }));

                    // 通知房间有新track
                    room_addr_ontrack.do_send(RoomNewTrackMessage {
                        session_id: session_id_ontrack.clone(),
                        local_track: local_track_byaddr.clone(),
                    });

                    // 写入当前结构体
                    local_track_ontrack
                        .lock()
                        .await
                        .borrow_mut()
                        .set(Some(local_track_byaddr.clone()));

                    // 把远端的Track数据包写入本地Track
                    while let Ok((packet, _)) = remote_track.read_rtp().await {
                        if let Err(err) = local_track_arc_read.write_rtp(&packet).await {
                            if webrtc::Error::ErrClosedPipe != err {
                                log::error!("output track write_rtp got error: {} and break", err);
                                break;
                            } else {
                                log::error!("output track write_rtp got error: {}", err);
                            }
                        }
                    }

                    log::info!(
                        "会话[{}]的轨道[{}]on_track监听结束",
                        session_id_ontrack,
                        track_id
                    );
                } else {
                    return;
                }
            })
        }));

        let ws_addr = self.ws_addr.clone();
        let peer_connection_onnegotiation_needed_clone = peer_connection.clone();
        peer_connection.on_negotiation_needed(Box::new(move || {
            let peer_connection_clone = peer_connection_onnegotiation_needed_clone.clone();
            let ws_addr_clone = ws_addr.clone();
            Box::pin(async move {
                log::info!("on_negotiation_needed");
                // 发送Offer
                RTCSession::create_sdp_and_send(
                    peer_connection_clone,
                    RTCSdpType::Offer,
                    ws_addr_clone,
                )
                .await
                .unwrap_or_default();
            })
        }));

        let engine_addr = self.engine_addr.clone();
        let session_id = self.session_id.clone();
        peer_connection.on_peer_connection_state_change(Box::new(move |state| {
            if state == RTCPeerConnectionState::Failed {
                log::info!("RTC会话[{}]连接失败，通知Engine退出", session_id);
                engine_addr.do_send(EngineExitRoomMessage {
                    session_id: session_id.clone(),
                    is_ws_disconnect: false,
                });
            }

            Box::pin(async move {})
        }));
    }

    pub async fn create_sdp_and_send(
        peer_connection: Arc<RTCPeerConnection>,
        sdp_type: RTCSdpType,
        ws_addr: Addr<WebSocketSession>,
    ) -> Result<(), webrtc::Error> {
        log::info!("create_sdp_and_send");
        let sdp = match sdp_type {
            RTCSdpType::Offer => {
                let offer = peer_connection.create_offer(None).await?;
                (offer, "rtc_offer")
            }
            RTCSdpType::Answer => {
                let answer = peer_connection.create_answer(None).await?;
                (answer, "rtc_answer")
            }
            _ => {
                return Err(webrtc::Error::new(
                    "create_sdp_and_send失败，未知SDP类型".to_owned(),
                ))
            }
        };

        peer_connection.set_local_description(sdp.0).await?;

        let mut gather_complete = peer_connection.gathering_complete_promise().await;
        gather_complete.recv().await;
        log::info!("gather_complete");

        // 将SDP发送给客户端
        if let Some(local_description) = peer_connection.local_description().await {
            if let Ok(sdp_json) = serde_json::to_string(&local_description) {
                let data_json = serde_json::to_string(&json!({ "sdp": sdp_json })).unwrap();
                ws_addr.do_send(WebSocketSendMessage {
                    event: sdp.1.to_owned(),
                    data: data_json,
                })
            }
        }

        Ok(())
    }
}

impl Actor for RTCSession {
    type Context = Context<Self>;

    fn started(&mut self, ctx: &mut Self::Context) {
        // 设置actor邮箱大小
        ctx.set_mailbox_capacity(64);
    }

    fn stopping(&mut self, ctx: &mut Self::Context) -> Running {
        if self.peer_connection_stopped == false {
            // 开始终止连接，由于peer_connection.close()为异步，则当前上下文需要等待连接关闭再结束
            let peer_connection = self.peer_connection.clone();
            let session_id = self.session_id.clone();
            async move {
                log::info!("RTC会话终止开始(stopping)，会话ID: {}", session_id);
                if let Some(close_err) = peer_connection.close().await.err() {
                    log::error!(
                        "RTC会话终止失败，会话ID: {}，Error：{}",
                        session_id,
                        close_err
                    );
                }
            }
            .into_actor(self)
            .map(|_, act, ctx| {
                act.peer_connection_stopped = true;
                ctx.stop();
            })
            .wait(ctx);

            Running::Continue
        } else {
            Running::Stop
        }
    }

    fn stopped(&mut self, _ctx: &mut Self::Context) {
        log::info!("RTC会话终止完毕(stopped)，会话ID: {}", self.session_id);
    }
}
