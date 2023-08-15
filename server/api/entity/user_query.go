package entity

import "github.com/golang-jwt/jwt/v5"

type CreateUserQuery struct {
	Username string `json:"username" validate:"required|min_len:2"`
	Nickname string `json:"nickname" validate:"required|min_len:2"`
	Password string `json:"password" validate:"required|min_len:6"`
}

type CreateUserResult struct {
	UserId       int64  `json:"userId"`
	SessionToken string `json:"sessionToken"`
}

type UserLoginQuery struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

type UserLoginResult struct {
	UserId       int64  `json:"userId"`
	SessionToken string `json:"sessionToken"`
}

type UserSessionClaims struct {
	UserId int64 `json:"userId"`
	jwt.RegisteredClaims
}
