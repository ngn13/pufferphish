package util

import (
	"math/rand"
	"os"
	"path"
	"strings"
)

var letters = []rune("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789")

func MakeRandom(l int) string{
  s := make([]rune, l)
  for i := range s {
    s[i] = letters[rand.Intn(len(letters))]
  }
  return string(s)
}

func ExistsFile(p string) bool {
  st, err := os.Stat(p)
  return err == nil && !st.IsDir()
}

func Join(p1 string, p2 string) string{
  p := path.Join(p1, p2)
  return strings.TrimSuffix(p, "/")
}
