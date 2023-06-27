package main

import (
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/joho/godotenv"
	"server/business"
	_ "server/ent/runtime"
	"server/storage"
)

func main() {
	_ = godotenv.Load()
	storage.InitStorage()
	defer storage.DbClient.Close()

	business.GlobalSocketServer = business.NewSocketServer()
	business.GlobalSocketServer.Start()

	app := fiber.New()
	app.Use(cors.New())
	_ = app.Listen(":8024")
}
