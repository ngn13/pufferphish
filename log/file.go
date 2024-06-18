package log

import (
	"fmt"
	"os"
	"path"
	"time"

	"github.com/ngn13/pufferphish/util"
)

type File struct {
  IP string
  Session string
}

func (f *File) Write(title string, msg string) error{
  dir := path.Join("logs", f.IP)
  file := path.Join(dir, f.Session+".log")

  err := os.MkdirAll(dir, 0700)
  if err != nil {
    return fmt.Errorf("failed to create logs directory: %s", err.Error())
  }

  var content string = ""

  if util.ExistsFile(file) {
    data, err := os.ReadFile(file)
    if err != nil {
      return fmt.Errorf("failed to read log file: %s", err.Error())
    }
    content = string(data)
  }

  t := time.Now()
  date := fmt.Sprintf("%02d/%02d/%d %02d:%02d:%02d",
        t.Day(), t.Month(), t.Year(),
        t.Hour(), t.Minute(), t.Second())
  content += fmt.Sprintf("[%s] %s => %s\n", date, title, msg)

  err = os.WriteFile(file, []byte(content), os.ModePerm)
  if err != nil {
    return fmt.Errorf("failed to write log file: %s", err.Error())
  }

  return nil
}
