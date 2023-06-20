package main

import (
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"server/business"
	"server/global"
)

func main() {
	global.SocketServer = business.NewSocketServer()
	global.SocketServer.Start()

	app := fiber.New()
	app.Use(cors.New())
	_ = app.Listen(":8024")
}
