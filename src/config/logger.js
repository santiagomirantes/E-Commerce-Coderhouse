const winston = require("winston")
const path = require("path")

//debug, http, info, warning, error, fatal

const customLevels = {
    levels:{
        fatal:0,
        error:1,
        warning:2,
        info:3,
        http:4,
        debug:5
    },
    colors:{
        fatal:"redBG white bold",
        error:"red",
        warning:"yellow",
        info:"blue",
        http:"grey",
        debug:"white"
    }
}


const logger = winston.createLogger({
    levels:customLevels.levels,
    transports:[
        new winston.transports.Console({
            level:process.env.STAGE === "DEVELOPMENT" ? "debug" : "info",
            format:winston.format.combine(
                winston.format.colorize({colors: customLevels.colors}),
                winston.format.simple()
            )
        }),
        new winston.transports.File({level:"warning",filename:"errors.log", dirname:path.join(__dirname,"../logs")})
    ]
})

const addLogger = (req,res,next) => {
    req.logger = logger
    req.logger.http(`${req.method} on ${req.url} - ${new Date().toLocaleTimeString()}`)
    next()
}

module.exports = addLogger