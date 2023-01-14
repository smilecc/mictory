package main

import (
	"github.com/gofiber/fiber/v2"
	"log"
	"net/http"
	_ "net/http/pprof"
	"server/engine"
)

func main() {
	go func() {
		log.Println(http.ListenAndServe("localhost:6060", nil))
	}()

	engine.NewEngine()
	app := fiber.New()
	engine.HandleWebsocket(app)

	engine.GlobalActorSystem.Root.Send(engine.EnginePID, engine.TestMessage{Hello: "233"})
	_ = app.Listen(":20424")
}
