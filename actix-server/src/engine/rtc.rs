use std::{cell::RefCell, sync::Arc, time::Duration};

use serde_json::json;
use tokio::sync::Mutex;
use webrtc::{
    api::{
        media_engine::{MediaEngine, MIME_TYPE_OPUS},
        APIBuilder,
    },
    ice::network_type::NetworkType,
    ice_transport::{
        ice_candidate::RTCIceCandidateInit, ice_candidate_type::RTCIceCandidateType,
        ice_server::RTCIceServer,
    },
    interceptor::registry::Registry,
    peer_connection::{
        configuration::RTCConfiguration,
        sdp::{sdp_type::RTCSdpType, session_description::RTCSessionDescription},
        RTCPeerConnection,
    },
    rtp_transceiver::rtp_codec::{RTCRtpCodecCapability, RTCRtpCodecParameters, RTPCodecType},
    track::{
        track_local::{track_local_static_rtp::TrackLocalStaticRTP, TrackLocalWriter},
        track_remote::TrackRemote,
    },
};

use actix::prelude::*;

use crate::engine::websocket::WebSocketSendMessage;

use super::websocket::{WebSocketMessage, WebSocketSession};

#[derive(Debug)]
pub struct RTCSession {
    session_id: String,
    room_id: String,
    peer_connection: Arc<RTCPeerConnection>,
    local_track: Arc<Mutex<RefCell<ValueWrapper<Option<Arc<TrackLocalStaticRTP>>>>>>,
    ws_addr: Addr<WebSocketSession>,
}

#[derive(Debug)]
pub struct ValueWrapper<T>(T);

impl<T> ValueWrapper<T> {
    pub fn set(&mut self, t: T) {
        self.0 = t;
    }
}

impl RTCSession {
    pub async fn new(
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
        setting_engine.set_interface_filter(Box::new(|x| {
            log::info!("interface {}", x);
            x == "以太网"
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

        // peer_connection
        //     .add_transceiver_from_kind(RTPCodecType::Audio, &[])
        //     .await?;

        Ok(peer_connection)
    }

    pub fn start_handle_rtc_event(&self) {
        let peer_connection = self.peer_connection.clone();
        let session_id = self.session_id.clone();
        let local_track = self.local_track.clone();

        peer_connection.on_track(Box::new(move |track, _| {
            let session_id_ontrack = session_id.clone();
            let local_track_ontrack = local_track.clone();

            Box::pin(async move {
                if let Some(remote_track) = track {
                    let local_track = TrackLocalStaticRTP::new(
                        remote_track.codec().await.capability,
                        session_id_ontrack.clone(),
                        session_id_ontrack.clone(),
                    );

                    // 写入当前结构体
                    let local_track_arc = Arc::new(local_track);
                    let local_track_arc_read = local_track_arc.clone();
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
        }))
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
pub struct RTCOfferMessage {
    pub sdp: String,
}

impl Handler<RTCOfferMessage> for RTCSession {
    type Result = ResponseFuture<()>;

    fn handle(&mut self, msg: RTCOfferMessage, _ctx: &mut Self::Context) -> Self::Result {
        let peer_connection = self.peer_connection.clone();
        let ws_addr = self.ws_addr.clone();
        Box::pin(async move {
            // 转换SDP，并设置成
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
pub struct RTCAnswerMessage {
    pub sdp: RTCSessionDescription,
}

impl Handler<RTCAnswerMessage> for RTCSession {
    type Result = ResponseFuture<()>;

    fn handle(&mut self, msg: RTCAnswerMessage, _ctx: &mut Self::Context) -> Self::Result {
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
                "CreateSDPAndSend失败，未知SDP类型".to_owned(),
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
