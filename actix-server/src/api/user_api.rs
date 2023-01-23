use actix_web::{get, web, Responder};
use jwt_simple::prelude::{Claims, Duration, MACLike};

use crate::AppState;

use super::{middleware::JWTAuthClaims, ResultBuilder};

#[get("/api/user/login")]
pub async fn login(app_state: web::Data<AppState>) -> impl Responder {
    let jwt_key = app_state.jwt_key.clone();
    let token = jwt_key
        .authenticate(Claims::with_custom_claims(
            JWTAuthClaims { user_id: 1 },
            Duration::from_days(365),
        ))
        .unwrap();
    ResultBuilder::success(token).ok()
}
