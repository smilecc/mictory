package api

import (
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/monitor"
)

func HandleRouters(app *fiber.App) {
	app.Get("/metrics", monitor.New())
	api := app.Group("/api", func(ctx *fiber.Ctx) error {
		return ctx.Next()
	})

	api.Get("/user", UserApiGetCurrentUser)
	api.Post("/user", UserApiCreateUser)
}
