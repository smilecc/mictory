package main

import (
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"server/business"
)

func main() {
	business.GlobalSocketServer = business.NewSocketServer()
	business.GlobalSocketServer.Start()

	app := fiber.New()
	app.Use(cors.New())
	_ = app.Listen(":8024")
}
