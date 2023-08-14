package entity

type CreateUserQuery struct {
	Username string `json:"username"`
	Nickname string `json:"nickname"`
	Password string `json:"password"`
}

type CreateUserResult struct {
	UserId       int64  `json:"userId"`
	SessionToken string `json:"sessionToken"`
}
