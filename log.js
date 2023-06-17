import fs from "fs"

class Logger{
  config(cfg){
    this.logfile = cfg["logfile"]
  }

  date(){
    return new Date().toJSON().slice(0, 19).replace("T", " ").replaceAll("-", "/")
  }

  banner(){
    const version = JSON.parse(fs.readFileSync("package.json"))["version"]
    console.log(`
                    dP,e,  dP,e,                         888     ,e,       888     
888 88e  8888 8888  8b "   8b "   ,e e,  888,8, 888 88e  888 ee   "   dP"Y 888 ee  
888 888b 8888 8888 888888 888888 d88 88b 888 "  888 888b 888 88b 888 C88b  888 88b 
888 888P Y888 888P  888    888   888   , 888    888 888P 888 888 888  Y88D 888 888 
888 88"   "88 88"   888    888    "YeeP" 888    888 88"  888 888 888 d,dP  888 888 
888                                             888                                
888                                             888           
                    
                pufferphish v${version} | github.com/ngn13/pufferphish
      `)
  }

  success(text){
    console.log(`SUCCESS  (${this.date()})`, text)
  }

  info(text){
    console.log(`INFO     (${this.date()})`, text)
  }

  error(text){
    console.log(`ERROR    (${this.date()})`, text)
    process.exit()
  }

  log(text){
    const txt = `(${this.date()}) `+text
    console.log(`LOG      ${txt}`) 

    if(!this.logfile)
      return

    try{
      fs.appendFileSync("logs.txt", txt+"\n")
    }catch(err){
      this.error("Can't append to 'logs.txt' | "+err)
    }

  }
}

export default Logger
