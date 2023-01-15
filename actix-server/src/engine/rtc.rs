use std::{cell::RefCell, sync::Arc, time::Duration};

use serde_json::json;
use tokio::sync::Mutex;
use webrtc::{
    api::{
        media_engine::{MediaEngine, MIME_TYPE_OPUS},
        APIBuilder,
    },
    ice::network_type::NetworkType,
    ice_transport::ice_candidate::RTCIceCandidateInit,
    interceptor::registry::Registry,
    peer_connection::{
        configuration::RTCConfiguration,
        sdp::{sdp_type::RTCSdpType, session_description::RTCSessionDescription},
        RTCPeerConnection,
    },
    rtp_transceiver::rtp_codec::{RTCRtpCodecCapability, RTCRtpCodecParameters, RTPCodecType},
    track::track_local::{track_local_static_rtp::TrackLocalStaticRTP, TrackLocalWriter},
};

use actix::prelude::*;

use crate::engine::websocket::WebSocketSendMessage;

use super::{
    engine::{Engine, EngineNewTrackMessage},
    websocket::WebSocketSession,
};

pub type ArcLocalTrack = Arc<Mutex<RefCell<ValueWrapper<Option<Arc<TrackLocalStaticRTP>>>>>>;

#[derive(Debug)]
pub struct RTCSession {
    session_id: String,
    room_id: String,
    peer_connection: Arc<RTCPeerConnection>,
    local_track: ArcLocalTrack,
    ws_addr: Addr<WebSocketSession>,
    engine_addr: Addr<Engine>,
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
        setting_engine.set_interface_filter(Box::new(|x| x == "以太网"));
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

        let session_id = self.session_id.clone();
        let local_track = self.local_track.clone();
        let engine_addr = self.engine_addr.clone();

        peer_connection.on_track(Box::new(move |track, _| {
            let session_id_ontrack = session_id.clone();
            let local_track_ontrack = local_track.clone();
            let engine_addr_ontrack = engine_addr.clone();

            Box::pin(async move {
                if let Some(remote_track) = track {
                    let local_track = TrackLocalStaticRTP::new(
                        remote_track.codec().await.capability,
                        session_id_ontrack.clone(),
                        session_id_ontrack.clone(),
                    );

                    let local_track_arc = Arc::new(local_track);
                    let local_track_arc_read = local_track_arc.clone();

                    // 通知engine有新track
                    engine_addr_ontrack.do_send(EngineNewTrackMessage {
                        session_id: session_id_ontrack.clone(),
                        local_track: local_track_arc.clone(),
                    });

                    // 写入当前结构体
                    local_track_ontrack
                        .lock()
                        .await
                        .borrow_mut()
                        .set(Some(local_track_arc));

                    // 把远端的Track数据包写入本地Track
                    while let Ok((packet, _)) = remote_track.read_rtp().await {
                        if let Err(err) = local_track_arc_read.write_rtp(&packet).await {
                            println!("output track write_rtp got error: {}", err);
                            break;
                        }
                    }
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
                create_sdp_and_send(peer_connection_clone, RTCSdpType::Offer, ws_addr_clone)
                    .await
                    .unwrap_or_default();
            })
        }));
    }
}

impl Actor for RTCSession {
    type Context = Context<Self>;

    fn stopped(&mut self, _ctx: &mut Self::Context) {
        log::info!("RTC会话终止，会话ID: {}", self.session_id);
    }
}

#[derive(Message)]
#[rtype(result = "()")]
pub struct RTCStopMessage {}

impl Handler<RTCStopMessage> for RTCSession {
    type Result = ();

    fn handle(&mut self, _msg: RTCStopMessage, ctx: &mut Self::Context) -> Self::Result {
        ctx.stop();
    }
}

#[derive(Message)]
#[rtype(result = "()")]
pub struct RTCCandidateMessage {
    pub candidate: RTCIceCandidateInit,
}

impl Handler<RTCCandidateMessage> for RTCSession {
    type Result = ResponseFuture<()>;

    fn handle(&mut self, msg: RTCCandidateMessage, _ctx: &mut Self::Context) -> Self::Result {
        let peer_connection = self.peer_connection.clone();
        Box::pin(async move {
            peer_connection
                .add_ice_candidate(msg.candidate)
                .await
                .unwrap_or_default();
        })
    }
}

#[derive(Message)]
#[rtype(result = "()")]
pub struct RTCReceiveOfferMessage {
    pub sdp: String,
}

impl Handler<RTCReceiveOfferMessage> for RTCSession {
    type Result = ResponseFuture<()>;

    fn handle(&mut self, msg: RTCReceiveOfferMessage, _ctx: &mut Self::Context) -> Self::Result {
        let peer_connection = self.peer_connection.clone();
        let ws_addr = self.ws_addr.clone();
        Box::pin(async move {
            // 转换SDP，并设置为remote_description
            let offer = serde_json::from_str::<RTCSessionDescription>(&msg.sdp).unwrap();
            if let Some(err) = peer_connection.set_remote_description(offer).await.err() {
                log::error!("{}", err);
                return;
            }

            create_sdp_and_send(peer_connection, RTCSdpType::Answer, ws_addr)
                .await
                .unwrap_or_default();
        })
    }
}

#[derive(Message)]
#[rtype(result = "()")]
pub struct RTCReceiveAnswerMessage {
    pub sdp: RTCSessionDescription,
}

impl Handler<RTCReceiveAnswerMessage> for RTCSession {
    type Result = ResponseFuture<()>;

    fn handle(&mut self, msg: RTCReceiveAnswerMessage, _ctx: &mut Self::Context) -> Self::Result {
        let peer_connection = self.peer_connection.clone();
        Box::pin(async move {
            if let Some(err) = peer_connection.set_remote_description(msg.sdp).await.err() {
                log::error!("{}", err);
            }
        })
    }
}

async fn create_sdp_and_send(
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

#[derive(Message)]
#[rtype(result = "()")]
pub struct RTCAddTrackMessage {
    pub source_session_id: String,
    pub local_track: Arc<TrackLocalStaticRTP>,
}

impl Handler<RTCAddTrackMessage> for RTCSession {
    type Result = ResponseFuture<()>;

    fn handle(&mut self, msg: RTCAddTrackMessage, _ctx: &mut Self::Context) -> Self::Result {
        let peer_connection = self.peer_connection.clone();
        let session_id = self.session_id.clone();
        Box::pin(async move {
            log::info!(
                "RTC会话{}增加来自于{}的轨道",
                session_id,
                msg.source_session_id
            );
            peer_connection.add_track(msg.local_track).await.unwrap();
        })
    }
}
