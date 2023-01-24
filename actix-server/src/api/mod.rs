use actix_web::{http::StatusCode, HttpResponse};
use serde::Serialize;
use serde_json::json;

pub mod middleware;
pub mod room_api;
pub mod server_api;
pub mod user_api;

pub struct ResultBuilder {
    result: serde_json::Value,
}

impl ResultBuilder {
    pub fn result<T>(code: i32, message: String, data: T) -> Self
    where
        T: Serialize,
    {
        Self::new(json!({
            "code": code,
            "message": message,
            "data": data,
        }))
    }

    pub fn success_with_null() -> Self {
        Self::result(0, "success".to_owned(), serde_json::Value::Null)
    }

    pub fn success<T>(data: T) -> Self
    where
        T: Serialize,
    {
        Self::result(0, "success".to_owned(), data)
    }

    pub fn fail(code: i32, message: String) -> Self {
        Self::result(code, message, serde_json::Value::Null)
    }

    pub fn fail_str(code: i32, message: &str) -> Self {
        Self::fail(code, message.to_string())
    }

    pub fn new(result: serde_json::Value) -> Self {
        ResultBuilder { result }
    }

    pub fn ok(&self) -> HttpResponse {
        HttpResponse::Ok().json(self.result.clone())
    }

    pub fn err(&self, status_code: StatusCode) -> HttpResponse {
        HttpResponse::build(status_code).json(self.result.clone())
    }
}
