package config

import (
	"encoding/json"
	"fmt"
	"os"
	"path"
	"strings"

	"github.com/ngn13/pufferphish/log"
	"github.com/ngn13/pufferphish/util"
)

type Type struct {
	Host      string   `json:"host"`
	Path      string   `json:"path"`
	Template  string   `json:"template"`
	Blacklist []string `json:"blacklist"`
  IPHeader  string   `json:"ip_header"`
}

func (c *Type) Read() (error){
  data, err := os.ReadFile("config.json")
  if err != nil {
    return fmt.Errorf("failed to read config.json: %s", err.Error())
  }

  err = json.Unmarshal(data, c)
  if err != nil {
    return fmt.Errorf("failed to load config.json: %s", err.Error())
  }

  if c.Host == "" {
    log.Warn("Host not specified in the configuration, using \"0.0.0.0:8080\"")
    c.Host = "0.0.0.0:8080"
  }

  if c.Path == "" || c.Path[0] != '/' {
    log.Warn("Invalid path (%s), using \"/\" instead", c.Path)
    c.Path = "/"
  }

  if c.Template == "" || strings.Contains(c.Template, ".") ||
     strings.Contains(c.Template, "/") || strings.Contains(c.Template, "\\"){
    return fmt.Errorf("invalid template")
  }

  temp := path.Join("templates", c.Template+".html")
  if !util.ExistsFile(temp){
    return fmt.Errorf("template not found")
  }

  return nil
}
