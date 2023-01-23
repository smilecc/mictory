use serde::{Deserialize, Serialize};
use std::{
    fs,
    future::{ready, Ready},
    sync::Arc,
};

use actix_web::{
    body::EitherBody,
    dev::{forward_ready, Service, ServiceRequest, ServiceResponse, Transform},
    http::{header, StatusCode},
    Error, FromRequest, HttpMessage,
};
use futures::future::LocalBoxFuture;
use jwt_simple::prelude::*;

use crate::api::ResultBuilder;

const JWT_SECRET_PATH: &str = "./.jwt_secret";

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct JWTAuthClaims {
    pub user_id: i64,
}

impl FromRequest for JWTAuthClaims {
    type Error = Error;

    type Future = Ready<Result<Self, Self::Error>>;

    fn from_request(
        req: &actix_web::HttpRequest,
        _payload: &mut actix_web::dev::Payload,
    ) -> Self::Future {
        let binding = req.extensions();
        let value = binding.get::<Self>();
        let result = match value {
            Some(v) => Ok(v.clone()),
            None => Err(actix_web::error::ErrorUnauthorized("Unauthorized")),
        };
        ready(result)
    }
}

// 读取JWT秘钥，如果没有则创建一个
pub fn init_jwt_key() -> HS512Key {
    if let Ok(secret) = fs::read_to_string(JWT_SECRET_PATH) {
        log::info!("加载JWT秘钥");
        let secret_bytes = secret.as_bytes();
        let mut base64_bin = vec![0u8; secret_bytes.as_ref().len()];

        let key_base64 = Base64::decode(&mut base64_bin, secret_bytes, None).unwrap();
        HS512Key::from_bytes(key_base64)
    } else {
        log::info!("初始化JWT秘钥");
        let key = HS512Key::generate();
        let key_base64 = Base64::encode_to_string(key.to_bytes()).unwrap();
        fs::write(JWT_SECRET_PATH, key_base64).unwrap();
        key
    }
}

// There are two steps in middleware processing.
// 1. Middleware initialization, middleware factory gets called with
//    next service in chain as parameter.
// 2. Middleware's call method gets called with normal request.
pub struct JWTAuth {
    pub jwt_key: HS512Key,
}

// Middleware factory is `Transform` trait
// `S` - type of the next service
// `B` - type of response's body
impl<S, B> Transform<S, ServiceRequest> for JWTAuth
where
    S: Service<ServiceRequest, Response = ServiceResponse<B>, Error = Error> + 'static,
    S::Future: 'static,
    B: 'static,
{
    type Response = ServiceResponse<EitherBody<B>>;
    type Error = Error;
    type InitError = ();
    type Transform = JWTAuthMiddleware<S>;
    type Future = Ready<Result<Self::Transform, Self::InitError>>;

    fn new_transform(&self, service: S) -> Self::Future {
        ready(Ok(JWTAuthMiddleware {
            service: Arc::new(service),
            jwt_key: self.jwt_key.clone(),
        }))
    }
}

pub struct JWTAuthMiddleware<S> {
    service: Arc<S>,
    jwt_key: HS512Key,
}

impl<S, B> Service<ServiceRequest> for JWTAuthMiddleware<S>
where
    S: Service<ServiceRequest, Response = ServiceResponse<B>, Error = Error> + 'static,
    S::Future: 'static,
    B: 'static,
{
    type Response = ServiceResponse<EitherBody<B>>;
    type Error = Error;
    type Future = LocalBoxFuture<'static, Result<Self::Response, Self::Error>>;

    forward_ready!(service);

    fn call(&self, req: ServiceRequest) -> Self::Future {
        println!("Hi from start. You requested: {}", req.path());

        let service = self.service.clone();
        let jwt_key = self.jwt_key.clone();

        Box::pin(async move {
            // 读取Header
            if let Some(header_auth) = req.headers().get(header::AUTHORIZATION) {
                // 解析Token
                let auth_token = header_auth.to_str().unwrap_or("").replace("Bearer ", "");
                let jwt_claims = jwt_key.verify_token::<JWTAuthClaims>(auth_token.as_str(), None);
                // 继续请求
                if let Ok(claims) = jwt_claims {
                    req.extensions_mut().insert(claims.custom.clone());
                    return service
                        .call(req)
                        .await
                        .map(ServiceResponse::map_into_left_body);
                }
            }

            Ok(req.into_response(
                ResultBuilder::fail(10401, "Unauthorized".to_string())
                    .err(StatusCode::UNAUTHORIZED)
                    .map_into_right_body(),
            ))
        })
    }
}
