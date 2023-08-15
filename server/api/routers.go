package api

import (
	"errors"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/monitor"
	"github.com/golang-jwt/jwt/v5"
	"github.com/gookit/goutil/strutil"
	"server/api/entity"
	"server/api/result"
	"server/storage"
)

func HandleRouters(app *fiber.App) {
	app.Get("/metrics", monitor.New())

	// 公共API
	publicApi := app.Group("/api")
	publicApi.Post("/user", UserApiCreateUser)
	publicApi.Post("/user/login", UserApiUserLogin)

	// 需要登录的API
	api := app.Group("/api", func(ctx *fiber.Ctx) error {
		// 解析会话token
		jwtToken := strutil.Replaces(ctx.Get("Authorization"), map[string]string{"Bearer ": ""})

		token, err := jwt.ParseWithClaims(jwtToken, &entity.UserSessionClaims{}, func(token *jwt.Token) (interface{}, error) {
			return []byte(storage.AppSecret), nil
		})

		if err != nil {
			if errors.Is(err, jwt.ErrTokenExpired) || errors.Is(err, jwt.ErrTokenNotValidYet) {
				return ctx.Status(fiber.StatusUnauthorized).JSON(result.NewFailResult(result.AuthTokenExpired))
			} else {
				return ctx.Status(fiber.StatusUnauthorized).JSON(result.NewFailResult(result.Unauthorized))
			}
		} else if token.Valid {
			ctx.Locals("UserClaims", token.Claims)
		}

		return ctx.Next()
	})

	api.Get("/user", UserApiGetCurrentUser)
}

func GetUserClaims(ctx *fiber.Ctx) *entity.UserSessionClaims {
	return ctx.Locals("UserClaims").(*entity.UserSessionClaims)
}
