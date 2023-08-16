package storage

import (
	"context"
	"server/ent"
	"server/ent/channel"
	"server/ent/user"
)

func ListUserChannels(ctx context.Context, dbClient *ent.Client, userId int64) []*ent.Channel {
	return dbClient.Channel.Query().
		Where(channel.HasUsersWith(user.ID(userId))).
		AllX(ctx)
}

func UserJoinChannel(ctx context.Context, dbClient *ent.Client, userId int64, channelId int64) (*ent.User, error) {
	return dbClient.User.UpdateOneID(userId).AddChannelIDs(channelId).Save(ctx)
}

func GetChannelByCode(ctx context.Context, dbClient *ent.Client, code string) *ent.Channel {
	return dbClient.Channel.Query().Where(channel.Code(code)).FirstX(ctx)
}
