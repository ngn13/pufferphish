import fs from "fs"
import chalk from "chalk"
import path from "path"

class Logger{
  date(){
    return new Date().toJSON().slice(0, 19).replace("T", " ").replaceAll("-", "/")
  }

  banner(){
    console.log(chalk.magenta(`                    dP,e,  dP,e,                         888     ,e,       888     
888 88e  8888 8888  8b "   8b "   ,e e,  888,8, 888 88e  888 ee   "   dP"Y 888 ee  
888 888b 8888 8888 888888 888888 d88 88b 888 "  888 888b 888 88b 888 C88b  888 88b 
888 888P Y888 888P  888    888   888   , 888    888 888P 888 888 888  Y88D 888 888 
888 88"   "88 88"   888    888    "YeeP" 888    888 88"  888 888 888 d,dP  888 888 
888                                             888                                
888                                             888           
      `))
  }

  success(text){
    console.log(chalk.bgGreen.black(" SUCCESS ")+` (${this.date()})`, text)
  }

  info(text){
    console.log(chalk.bgBlue.black(" INFO ")+`    (${this.date()})`, text)
  }

  error(text){
    console.log(chalk.bgRed.black(" ERROR ")+`   (${this.date()})`, text)
    process.exit()
  }

  log(dir, type, text){
    if (!fs.existsSync("logs")) {
      fs.mkdirSync("logs")
    }

    if (!fs.existsSync(path.join("logs", dir))) {
      fs.mkdirSync(path.join("logs", dir))
    }

    let file = path.join("logs", dir, type)
    try {
      fs.appendFileSync(file, text)
    }catch(err) {
      this.error("Can't append to "+file+": "+err)
    }
  }
}

export default Logger
