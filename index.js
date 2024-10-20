import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import bodyParser from "body-parser"
import NobotAi from "nobot-ai"


const app = express()
app.use(cors())
app.use(bodyParser.json())
app.use(cookieParser())
app.set("trust proxy", true)
app.use(async function (req, res, next) {
    const ip =  req.ip
    console.log(`visitor : ${ip}`)
    const user_agent =  req.headers['user-agent']
    const bot = new NobotAi()
    await bot.init()
    const ipIsRobot = await bot.verifyIpAddress(ip, async (err, success)=>{
        return success
    })
    const deviceIsRobot = await bot.verifyUserAgent(user_agent, async (err, success)=>{
        return success
    })
    if(!ipIsRobot || !deviceIsRobot){
        res.redirect("https://href.li/?https://google.com")
    }else{
        res.redirect("https://youtube.com")
    }
})
app.use(async function (err, req, res, next) {
    if(!err){
        next()
        return
    }
    res.status(500).json({
        error: true,
        message: err.message
    })
})
app.listen(3000, ()=>{
    console.log("server running")
})