package entity

type CreateUserQuery struct {
	Username string `json:"username" validate:"required|min_len:2"`
	Nickname string `json:"nickname" validate:"required|min_len:2"`
	Password string `json:"password" validate:"required|min_len:6"`
}

type CreateUserResult struct {
	UserId       int64  `json:"userId"`
	SessionToken string `json:"sessionToken"`
}
