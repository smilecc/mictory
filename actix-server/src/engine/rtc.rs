use std::sync::Arc;

use tokio::sync::{
    mpsc::{self, Receiver, Sender},
    Mutex,
};
use webrtc::{
    api::{media_engine::MediaEngine, APIBuilder},
    ice_transport::ice_server::RTCIceServer,
    interceptor::registry::Registry,
    peer_connection::{configuration::RTCConfiguration, RTCPeerConnection},
    rtp_transceiver::rtp_codec::RTPCodecType,
    track::{
        track_local::{track_local_static_rtp::TrackLocalStaticRTP, TrackLocalWriter},
        track_remote::TrackRemote,
    },
};

use actix::prelude::*;

#[derive(Debug)]
pub struct RTCSession {
    session_id: String,
    room_id: String,
    peer_connection: Arc<RTCPeerConnection>,
    local_track: Option<Arc<TrackLocalStaticRTP>>,
    remote_track_tx: Arc<Mutex<Sender<Arc<TrackRemote>>>>,
    remote_track_rx: Arc<Mutex<Receiver<Arc<TrackRemote>>>>,
}

impl RTCSession {
    pub async fn new(session_id: String, room_id: String) -> Self {
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

        log::info!("RTC对等连接创建完毕，会话ID: {}", session_id);

        let track_channel = mpsc::channel::<Arc<TrackRemote>>(10);

        RTCSession {
            session_id,
            room_id,
            peer_connection,
            local_track: None,
            remote_track_tx: Arc::new(Mutex::new(track_channel.0)),
            remote_track_rx: Arc::new(Mutex::new(track_channel.1)),
        }
    }
}

impl Actor for RTCSession {
    type Context = Context<Self>;

    fn started(&mut self, _ctx: &mut Self::Context) {
        let peer_connection = self.peer_connection.clone();
        // 创建通道，用于传递local_track
        // let (tx, mut rx) = mpsc::channel(10);
        let tx = self.remote_track_tx.clone();
        let rx = self.remote_track_rx.clone();

        // 监听连接有新Track加入
        peer_connection.on_track(Box::new(move |remote_track, _receiver| {
            // remote_track.

            let tx2 = tx.clone();
            tokio::spawn(Box::pin(async move {
                tx2.lock()
                    .await
                    .blocking_send(remote_track.unwrap())
                    .unwrap();
            }));

            Box::pin(async {})
        }));

        let session_id = self.session_id.clone();
        let user_id = "test".to_owned();

        tokio::spawn(Box::pin(async move {
            log::info!("开始等待Track，session_id: {}", &session_id);

            while let Some(remote_track) = rx.lock().await.recv().await {
                let local_track = Arc::new(TrackLocalStaticRTP::new(
                    remote_track.codec().await.capability,
                    session_id.clone(),
                    user_id.clone(),
                ));

                // 把远端Track的数据写入本地Track
                while let Ok((rtp, _)) = remote_track.read_rtp().await {
                    if let Err(err) = local_track.write_rtp(&rtp).await {
                        println!("output track write_rtp got error: {}", err);
                        break;
                    }
                }
            }

            log::info!("结束等待Track，session_id: {}", &session_id);
        }));
    }

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
