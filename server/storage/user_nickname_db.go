package storage

import (
	"context"
	"github.com/golang-jwt/jwt/v5"
	"server/ent"
	"server/ent/usernickname"
)

// ApplyUserNickname 申请用户昵称
func ApplyUserNickname(ctx context.Context, dbClient *ent.Client, nickname string) (*ent.UserNickname, error) {
	userNicknames, err := dbClient.UserNickname.
		Query().
		Where(usernickname.Nickname(nickname)).
		All(ctx)

	if err != nil {
		return nil, err
	}

	var userNickname *ent.UserNickname

	// 如果没有 则创建一个
	if len(userNicknames) == 0 {
		userNickname, err = dbClient.UserNickname.Create().
			SetNickname(nickname).
			SetNo(0).
			Save(ctx)

		if err != nil {
			return nil, err
		}
	} else {
		userNickname = userNicknames[0]
	}

	// 给昵称的no进行自增
	userNickname, err = dbClient.UserNickname.
		UpdateOneID(userNickname.ID).
		AddNo(1).
		Save(ctx)

	if err != nil {
		return nil, err
	}

	return userNickname, nil
}

// GenerateUserSessionToken 生成用户会话令牌
func GenerateUserSessionToken(user *ent.User) (string, error) {
	token := jwt.NewWithClaims(jwt.SigningMethodHS512, jwt.MapClaims{
		"userId": user.ID,
	})
	return token.SignedString([]byte(AppSecret))
}
