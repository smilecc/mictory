package main

import (
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/adaptor"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/fiber/v2/middleware/recover"
	"github.com/joho/godotenv"
	httpCors "github.com/rs/cors"
	"net/http"
	"server/api"
	"server/business"
	_ "server/ent/runtime"
	"server/storage"
)

func main() {
	_ = godotenv.Load()
	storage.InitStorage()
	defer storage.DbClient.Close()

	mux := http.NewServeMux()
	business.GlobalSocketServer = business.NewSocketServer()
	business.GlobalSocketServer.Handle(mux)

	app := fiber.New()
	app.Use(logger.New())
	app.Use(recover.New())
	api.HandleRouters(app)
	mux.Handle("/", adaptor.FiberApp(app))

	_ = http.ListenAndServe(":8025", httpCors.Default().Handler(mux))
	//app.Use(cors.New())
	//_ = app.Listen(":8024")
}
