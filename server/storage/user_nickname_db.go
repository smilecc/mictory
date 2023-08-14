package storage

import (
	"context"
	"server/ent"
	"server/ent/usernickname"
)

func ApplyUserNickname(ctx context.Context, dbClient *ent.Client, nickname string) (*ent.UserNickname, error) {
	userNickname, err := dbClient.UserNickname.
		Query().
		Where(usernickname.Nickname(nickname)).
		First(ctx)

	if err != nil {
		return nil, err
	}

	// 如果没有 则创建一个
	if userNickname == nil {
		userNickname, err = dbClient.UserNickname.Create().
			SetNickname(nickname).
			SetNo(0).
			Save(ctx)

		if err != nil {
			return nil, err
		}
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
