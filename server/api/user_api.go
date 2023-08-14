package api

import (
	"context"
	"crypto/sha256"
	"github.com/gofiber/fiber/v2"
	"github.com/gookit/goutil/strutil"
	"server/api/entity"
	"server/storage"
)

func UserApiGetCurrentUser(ctx *fiber.Ctx) error {
	return nil
}

func UserApiCreateUser(c *fiber.Ctx) error {
	q := new(entity.CreateUserQuery)
	if err := c.BodyParser(q); err != nil {
		return err
	}

	passwordSalt := strutil.RandomCharsV3(64)
	passwordHash := sha256.Sum256([]byte(q.Password + passwordSalt))

	txCtx := context.Background()
	tx, err := storage.DbClient.BeginTx(txCtx, nil)
	if err != nil {
		return err
	}

	userNickname, err := storage.ApplyUserNickname(txCtx, tx.Client(), q.Nickname)
	if err != nil {
		return err
	}

	tx.User.
		Create().
		SetUsername(q.Username).
		SetNickname(q.Nickname).
		SetNicknameNo(userNickname.No).
		SetPassword(string(passwordHash[:])).
		SetPasswordSalt(passwordSalt)

	return nil
}
