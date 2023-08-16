package main

import (
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/adaptor"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/fiber/v2/middleware/recover"
	"github.com/gookit/goutil/fsutil"
	"github.com/gookit/goutil/strutil"
	"github.com/joho/godotenv"
	httpCors "github.com/rs/cors"
	"net/http"
	"os"
	"server/api"
	"server/business"
	_ "server/ent/runtime"
	"server/storage"
)

func main() {
	GenerateAppSecret()

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

	_ = http.ListenAndServe(":"+storage.GetEnv("SERVER_PORT", "8025"), httpCors.Default().Handler(mux))
	//app.Use(cors.New())
	//_ = app.Listen(":8024")
}

// GenerateAppSecret 生成应用秘钥
func GenerateAppSecret() {
	path := storage.GetEnv("APP_SECRET_PATH", "./.secret")
	if fsutil.PathExist(path) {
		storage.AppSecret = fsutil.ReadString(path)
	} else {
		randomString, err := strutil.RandomString(64)
		if err != nil {
			panic(err)
		}

		storage.AppSecret = randomString
		err = fsutil.WriteFile(path, randomString, os.ModeDir)
		if err != nil {
			panic(err)
		}
	}
}
