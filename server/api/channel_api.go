package api

import (
	"context"
	"github.com/gofiber/fiber/v2"
	"server/api/entity"
	"server/api/result"
	"server/ent"
	"server/ent/channel"
	"server/ent/room"
	"server/storage"
	"strconv"
)

func ChannelApiGetChannel(c *fiber.Ctx) error {
	dbCtx := context.Background()
	channelCode := c.Params("channelCode")

	list := storage.DbClient.Channel.Query().
		Where(channel.Code(channelCode)).
		WithOwnerUser().
		WithUsers().
		WithRooms(func(query *ent.RoomQuery) {
			query.Order(room.BySort())
		}).
		FirstX(dbCtx)

	return c.JSON(result.NewOkResult(&list))
}

// ChannelApiListUserChannels 获取用户频道列表
func ChannelApiListUserChannels(c *fiber.Ctx) error {
	dbCtx := context.Background()
	claims := GetUserClaims(c)

	list := storage.ListUserChannels(dbCtx, storage.DbClient, claims.UserId)

	return c.JSON(result.NewOkResult(&list))
}

// ChannelApiCreateChannel 创建频道
func ChannelApiCreateChannel(c *fiber.Ctx) error {
	q := new(entity.CreateChannelQuery)
	if err := c.BodyParser(q); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(result.NewErrorResult(err))
	}

	claims := GetUserClaims(c)
	dbCtx := context.Background()
	tx, err := storage.DbClient.BeginTx(dbCtx, nil)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(result.NewErrorResult(storage.RollbackTx(tx, err)))
	}

	// 创建频道
	newChannel, err := tx.Channel.Create().
		SetOwnerUserID(claims.UserId).
		SetName(q.ChannelName).
		Save(dbCtx)

	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(result.NewErrorResult(storage.RollbackTx(tx, err)))
	}

	// 修改频道编码
	newChannel, err = newChannel.Update().SetCode(strconv.FormatInt((newChannel.ID*424)+961022, 36)).Save(dbCtx)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(result.NewErrorResult(storage.RollbackTx(tx, err)))
	}

	// 创建人默认加入频道
	_, err = storage.UserJoinChannel(dbCtx, storage.DbClient, claims.UserId, newChannel.ID)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(result.NewErrorResult(storage.RollbackTx(tx, err)))
	}

	// 创建一个默认房间
	_, err = tx.Room.Create().
		SetChannelID(newChannel.ID).
		SetName("Voice").
		Save(dbCtx)

	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(result.NewErrorResult(storage.RollbackTx(tx, err)))
	}

	err = tx.Commit()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(result.NewErrorResult(storage.RollbackTx(tx, err)))
	}

	return c.JSON(result.NewOkResult(newChannel))
}

// ChannelApiJoinChannel 加入频道
func ChannelApiJoinChannel(c *fiber.Ctx) error {
	dbCtx := context.Background()
	claims := GetUserClaims(c)
	channelCode := c.Params("channelCode")

	joinChannel := storage.GetChannelByCode(dbCtx, storage.DbClient, channelCode)

	user, err := storage.UserJoinChannel(dbCtx, storage.DbClient, claims.UserId, joinChannel.ID)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(result.NewErrorResult(err))
	}

	return c.JSON(result.NewOkResult(user))
}
