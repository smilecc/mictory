package api

import (
	"context"
	"github.com/gofiber/fiber/v2"
	"github.com/gookit/goutil/strutil"
	"github.com/gookit/validate"
	"server/api/entity"
	"server/api/result"
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

	v := validate.Struct(q)
	if !v.Validate() {
		return c.Status(400).JSON(result.NewErrorResultWithMessage(result.ValidateFail, v.Errors.One()))
	}

	passwordSalt, _ := strutil.RandomString(64)
	passwordHash := storage.GenerateUserPasswordHash(q.Password, passwordSalt)

	txCtx := context.Background()
	tx, err := storage.DbClient.BeginTx(txCtx, nil)
	if err != nil {
		return err
	}

	// 查询用户名有没有被使用
	existUsername := storage.GetUserByUsername(txCtx, tx.Client(), q.Username)

	if existUsername != nil {
		_ = storage.RollbackTx(tx, err)
		return c.Status(fiber.StatusBadRequest).JSON(result.NewErrorResult(result.UsernameExist))
	}

	// 申请用户昵称
	userNickname, err := storage.ApplyUserNickname(txCtx, tx.Client(), q.Nickname)
	if err != nil {
		return storage.RollbackTx(tx, err)
	}

	// 写入用户
	user, err := tx.User.
		Create().
		SetUsername(q.Username).
		SetNickname(q.Nickname).
		SetNicknameNo(userNickname.No).
		SetPassword(passwordHash).
		SetPasswordSalt(passwordSalt).
		Save(txCtx)

	if err != nil {
		return storage.RollbackTx(tx, err)
	}

	sessionToken, err := storage.GenerateUserSessionToken(user)
	if err != nil {
		return storage.RollbackTx(tx, err)
	}

	err = tx.Commit()
	if err != nil {
		return storage.RollbackTx(tx, err)
	}

	return c.JSON(result.NewSuccessResult(&entity.CreateUserResult{
		UserId:       user.ID,
		SessionToken: sessionToken,
	}))
}

func UserApiUserLogin(c *fiber.Ctx) error {
	q := new(entity.UserLoginQuery)
	if err := c.BodyParser(q); err != nil {
		return err
	}

	v := validate.Struct(q)
	if !v.Validate() {
		return c.Status(400).JSON(result.NewErrorResultWithMessage(result.ValidateFail, v.Errors.One()))
	}

	dbCtx := context.Background()
	user := storage.GetUserByUsername(dbCtx, storage.DbClient, q.Username)

	if user == nil {
		return c.Status(400).JSON(result.NewErrorResult(result.LoginFail))
	}

	loginPasswordHash := storage.GenerateUserPasswordHash(q.Password, user.PasswordSalt)

	if loginPasswordHash != user.Password {
		return c.Status(400).JSON(result.NewErrorResult(result.LoginFail))
	}

	sessionToken, err := storage.GenerateUserSessionToken(user)
	if err != nil {
		return err
	}

	return c.JSON(result.NewSuccessResult(&entity.UserLoginResult{
		UserId:       user.ID,
		SessionToken: sessionToken,
	}))
}
