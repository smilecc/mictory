use actix_web::{get, http::StatusCode, post, web, Responder};
use jwt_simple::{
    prelude::{Base64, Claims, Duration, MACLike},
    reexports::ct_codecs::{Encoder, Error as Base64Error},
};
use nanoid::nanoid;
use sea_orm::{
    ActiveModelTrait, ColumnTrait, EntityTrait, PaginatorTrait, QueryFilter, QuerySelect, Set,
    TransactionTrait,
};
use serde::{Deserialize, Serialize};
use serde_json::json;
use sha2::{Digest, Sha512};
use validator::Validate;

use crate::{
    business::server_business,
    model::{user, user_nickname},
    AppState,
};

use super::{middleware::JWTAuthClaims, ResultBuilder};

#[get("/api/user/{id}")]
pub async fn get_user(app_state: web::Data<AppState>, path: web::Path<(i64,)>) -> impl Responder {
    let user = user::Entity::find_by_id(path.0)
        .one(app_state.db.clone().as_ref())
        .await
        .unwrap();

    ResultBuilder::success(user).ok()
}

#[derive(Debug, Deserialize, Serialize, Validate)]
#[serde(rename_all = "camelCase")]
pub struct UserLoginQuery {
    pub account: String,
    pub password: String,
}

#[post("/api/user/login")]
pub async fn login(
    app_state: web::Data<AppState>,
    login_query: web::Json<UserLoginQuery>,
) -> impl Responder {
    // 查询用户
    let user_record = user::Entity::find()
        .filter(user::Column::Email.eq(login_query.account.clone()))
        .one(app_state.db.as_ref())
        .await
        .unwrap();

    let user = if let Some(u) = user_record {
        u
    } else {
        return ResultBuilder::fail_str(10400, "用户不存在或密码错误").err(StatusCode::BAD_REQUEST);
    };

    // 比对密码
    let password_hash =
        build_paassword_hash(&login_query.password, &user.password_salt).unwrap_or("".to_string());
    if password_hash != user.password {
        return ResultBuilder::fail_str(10400, "用户不存在或密码错误").err(StatusCode::BAD_REQUEST);
    }

    // 创建token
    let jwt_key = app_state.jwt_key.clone();
    let token = jwt_key
        .authenticate(Claims::with_custom_claims(
            JWTAuthClaims {
                user_id: user.id.clone(),
            },
            Duration::from_days(365),
        ))
        .unwrap();

    ResultBuilder::success(json!({
        "accessToken": token,
        "userId": user.id.clone(),
    }))
    .ok()
}

#[derive(Debug, Deserialize, Serialize, Validate)]
#[serde(rename_all = "camelCase")]
pub struct CreateUserQuery {
    #[validate(email(message = "请输入有效的邮箱"))]
    pub email: String,
    #[validate(length(min = 2, max = 16, message = "请输入2-16位的昵称"))]
    pub nickname: String,
    #[validate(length(min = 6, message = "密码不得低于6位"))]
    pub password: String,
}

#[post("/api/user")]
pub async fn create_user(
    app_state: web::Data<AppState>,
    create_query: web::Json<CreateUserQuery>,
) -> impl Responder {
    if let Some(e) = create_query.0.validate().err() {
        return ResultBuilder::fail(10400, format!("{}", e)).err(StatusCode::BAD_REQUEST);
    }

    // 生成密码盐
    let password_salt = nanoid!(120);

    // 生成密码hash
    let password_hash = match build_paassword_hash(&create_query.password, &password_salt) {
        Ok(h) => h,
        Err(err) => {
            log::error!("密码Hash生成错误 {create_query:?} {err:?}");
            return ResultBuilder::fail(10500, "密码Hash生成错误".to_owned())
                .err(StatusCode::INTERNAL_SERVER_ERROR);
        }
    };

    let txn = app_state.db.begin().await.unwrap();

    // 查询邮箱是否占用
    let email_count = user::Entity::find()
        .filter(user::Column::Email.eq(create_query.email.clone()))
        .count(&txn)
        .await
        .unwrap_or(1);

    if email_count > 0 {
        return ResultBuilder::fail(10400, "该邮箱已被注册".to_owned())
            .err(StatusCode::BAD_REQUEST);
    }

    // 占用一个昵称编号
    let nickname_no = match increment_nickname_no(&txn, &create_query.nickname).await {
        Ok(no) => no,
        Err(err) => {
            log::error!("昵称编号占用失败 {create_query:?} {err:?}");
            return ResultBuilder::fail(10500, "昵称编号占用失败".to_owned())
                .err(StatusCode::INTERNAL_SERVER_ERROR);
        }
    };

    // 写入用户记录
    let new_user = user::ActiveModel {
        email: Set(create_query.email.clone()),
        nickname: Set(create_query.nickname.clone()),
        nickname_no: Set(nickname_no),
        password: Set(password_hash),
        password_salt: Set(password_salt.clone()),
        ..Default::default()
    }
    .insert(&txn)
    .await
    .unwrap();

    // 给用户创建默认服务器
    server_business::create_server(
        &txn,
        &format!("{}的服务器", create_query.nickname),
        &new_user.id,
    )
    .await;

    txn.commit().await.unwrap();
    ResultBuilder::success_with_null().ok()
}

pub fn build_paassword_hash(password: &str, salt: &str) -> Result<String, Base64Error> {
    let mut password_hasher = Sha512::new();
    password_hasher.update(password.as_bytes());
    password_hasher.update(b"&");
    password_hasher.update(salt.as_bytes());
    let password_hash = password_hasher.finalize();
    Base64::encode_to_string(password_hash)
}

// 增加昵称编号
pub async fn increment_nickname_no<C>(db: &C, nickname: &str) -> Result<i32, sea_orm::DbErr>
where
    C: sea_orm::ConnectionTrait,
{
    let nickname_record = user_nickname::Entity::find()
        .filter(user_nickname::Column::Nickname.eq(nickname))
        .lock_exclusive()
        .one(db)
        .await
        .unwrap_or(None);

    let no = if let Some(record) = nickname_record {
        // 更新记录编号
        let mut update_record: user_nickname::ActiveModel = record.into();
        let next_no = update_record.no.unwrap() + 1;
        update_record.no = Set(next_no.clone());
        update_record.update(db).await?;
        next_no
    } else {
        // 新增记录编号
        let next_no = 1000;
        let insert_record = user_nickname::ActiveModel {
            nickname: Set(nickname.to_string()),
            no: Set(next_no.clone()),
            ..Default::default()
        };

        insert_record.insert(db).await?;
        next_no
    };

    Ok(no)
}
