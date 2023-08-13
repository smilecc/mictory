package entity

type CreateUserQuery struct {
	Username string `json:"username"`
	Password string `json:"password"`
}
