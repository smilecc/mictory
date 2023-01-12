use std::{
    cell::RefCell,
    sync::{Arc, Mutex},
};

use tokio::sync::mpsc;
use webrtc::{
    api::{media_engine::MediaEngine, APIBuilder},
    ice_transport::ice_server::RTCIceServer,
    interceptor::registry::Registry,
    peer_connection::{configuration::RTCConfiguration, RTCPeerConnection},
    rtp_transceiver::rtp_codec::RTPCodecType,
    track::track_local::track_local_static_rtp::TrackLocalStaticRTP,
};

use actix::prelude::*;

#[derive(Debug)]
pub struct RTCSession {
    session_id: String,
    room_id: String,
    peer_connection: Arc<RTCPeerConnection>,
    local_track: Option<Arc<TrackLocalStaticRTP>>,
}

impl RTCSession {
    async fn new(session_id: String, room_id: String) -> Self {
        // 初始化配置项
        let mut setting_engine = webrtc::api::setting_engine::SettingEngine::default();
        setting_engine.set_lite(true);

        // 初始化编码器
        let mut media_engine = MediaEngine::default();
        media_engine.register_default_codecs().unwrap();

        let registry = Registry::new();

        let api = APIBuilder::new()
            .with_media_engine(media_engine)
            .with_setting_engine(setting_engine)
            .with_interceptor_registry(registry)
            .build();

        let config = RTCConfiguration {
            ice_servers: vec![RTCIceServer {
                urls: vec!["stun:stun.l.google.com:19302".to_owned()],
                ..Default::default()
            }],
            bundle_policy:
                webrtc::peer_connection::policy::bundle_policy::RTCBundlePolicy::MaxBundle,
            rtcp_mux_policy:
                webrtc::peer_connection::policy::rtcp_mux_policy::RTCRtcpMuxPolicy::Require,
            ..Default::default()
        };

        let peer_connection = Arc::new(api.new_peer_connection(config).await.unwrap());

        peer_connection
            .add_transceiver_from_kind(RTPCodecType::Audio, &[])
            .await
            .unwrap();

        RTCSession {
            session_id,
            room_id,
            peer_connection,

            local_track: None,
        }
    }
}

impl Actor for RTCSession {
    type Context = Context<Self>;

    fn started(&mut self, ctx: &mut Self::Context) {
        let peer_connection = self.peer_connection.clone();
        // 创建通道，用于传递local_track
        let (tx, mut rx) = mpsc::channel::<Arc<TrackLocalStaticRTP>>(2);

        peer_connection.on_track(Box::new(move |track, _| {
            if let Some(remote_track) = track {
                log::info!("Trace PayloadType {}", remote_track.payload_type());

                let (tx2, mut rx2) = mpsc::channel::<Arc<TrackLocalStaticRTP>>(2);

                tokio::spawn(async move {
                    let local_track = TrackLocalStaticRTP::new(
                        remote_track.codec().await.capability,
                        "".to_owned(),
                        "".to_owned(),
                    );

                    tx2.send(Arc::new(local_track)).await.unwrap();
                });

                if let Some(local_track) = rx2.blocking_recv() {
                    tx.send(local_track);
                    // self.local_track = Some(local_track);
                }
            };

            Box::pin(async {})
        }));

        if let Some(local_track) = rx.blocking_recv() {
            self.local_track = Some(local_track);
        }
    }
}
