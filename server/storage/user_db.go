package storage

import (
	"context"
	"crypto/sha256"
	"encoding/hex"
	"server/ent"
	"server/ent/user"
)

func GetUserByUsername(ctx context.Context, dbClient *ent.Client, username string) *ent.User {
	first, err := dbClient.User.Query().Where(user.Username(username)).First(ctx)
	if err != nil {
		return nil
	}

	return first
}

// GenerateUserPasswordHash 生成用户密码哈希值
func GenerateUserPasswordHash(password string, salt string) string {
	return hex.EncodeToString(sha256.New().Sum([]byte(AppSecret + password + salt)))
}
