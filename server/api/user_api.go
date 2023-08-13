package api

import (
	"github.com/gofiber/fiber/v2"
	"server/api/entity"
	"server/storage"
)

func UserApiGetCurrentUser(ctx *fiber.Ctx) error {
	return nil
}

func UserApiCreateUser(ctx *fiber.Ctx) error {
	q := new(entity.CreateUserQuery)
	if err := ctx.BodyParser(q); err != nil {
		return err
	}

	storage.DbClient.User.
		Create().
		SetUsername(q.Username)

	return nil
}
