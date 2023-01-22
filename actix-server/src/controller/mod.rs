use actix_web::HttpResponse;
use serde::Serialize;
use serde_json::json;

pub mod room_controller;
pub mod server_controller;

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
        Self::result(0, "success".to_owned(), serde_json::Value::Null)
    }

    pub fn fail(code: i32, message: String) -> Self {
        Self::result(code, message, serde_json::Value::Null)
    }

    pub fn new(result: serde_json::Value) -> Self {
        ResultBuilder { result }
    }

    pub fn ok(&self) -> HttpResponse {
        HttpResponse::Ok().json(self.result.clone())
    }
}
