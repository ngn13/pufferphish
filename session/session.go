package session

import "github.com/ngn13/pufferphish/util"

var sessions []string

func New() string {
  session := util.MakeRandom(7)
  sessions = append(sessions, session)
  return session
}

func Contains(s string) bool{
  for i := range sessions{
    if sessions[i] == s {
      return true
    }
  }
  return false
}

func Del(s string){
  for i := range sessions{
    if sessions[i] != s {
      continue
    }
    sessions = append(sessions[:i], sessions[i+1:]...)
    return
  }
}
