/*imports*/

require("dotenv").config("../.env")


const express = require("express")
const path = require("path")
const { create } = require("express-handlebars")
const http = require('http');
const { Server } = require('socket.io');
const { connect } = require("./dao/Managers/Mongo/connect")
const cookieParser = require("cookie-parser")
const passport = require("passport")
const { initPass, checkAuth } = require("./config/passport")
const addLogger = require("./config/logger")
const cluster = require("cluster")
const { cpus } = require("os")
const swaggerJsDoc = require("swagger-jsdoc")
const swaggerUIExpress = require("swagger-ui-express")

/*cluster*/

if (cluster.isPrimary) {
    const allCpus = cpus()
    for (let i in allCpus) {
        cluster.fork()
    }
}
else {
    console.log("Worker created")

    /*creating the server and working with the imported packages*/

    const app = express()
    const port = 8080 || process.env.PORT
    const server = http.createServer(app)
    const io = new Server(server)

    /*sessions*/

    const secret = "AF6V<Q$[S!uw9EM*/kTv,5jH6=_T%5^4Apb?<a$PFkU"

    /*app.use(session({
        secret,
        resave: false,
        saveUninitialized: true
    }));*/

    app.use(passport.initialize())
    initPass()


    /*handlebars*/

    const hbs = create({
        helpers: {
            capitalize(str) { return str.charAt(0).toUpperCase() + str.slice(1) }
        }
    })

    app.engine("handlebars", hbs.engine)
    app.set("view engine", "handlebars")
    app.set('views', path.join(__dirname, "views"));

    /*cookie-parser*/

    app.use(cookieParser())

    /*swagger*/

    const swaggerOptions = {
        definition:{
            openapi:"3.0.1",
            info:{
                title:"Documentación backend CoderHouse",
                description:"Documentación del proyecto de backend de un e-commerce"
            }
        },
        apis:[path.join(__dirname,"/docs/**/*.yaml")]
    }

    const specs = swaggerJsDoc(swaggerOptions)

    app.use("/apidocs",swaggerUIExpress.serve,swaggerUIExpress.setup(specs))

    /*socket io*/

    io.on('connection', (socket) => {
        console.log('Nuevo usuario conectado');

        //this is for the products.route management of messages

        productsRouter.setupIO(socket)

        socket.emit("connection", "")

        socket.on('message', (data) => {
            console.log('Mensaje recibido:', data);
            io.emit('message', { text: 'Hola a todos!' });
        });

        socket.on('disconnect', () => {
            console.log('Usuario desconectado');
        });
    });

    /*Winston*/

    app.use(addLogger)


    /*using*/

    app.use(express.static("public"))
    app.use(express.json())
    // Middleware to connect to the database before accessing the router
    app.use(async (req, res, next) => {
        try {
            await connect()
            next()
        } catch (error) {
            req.logger.fatal('Failed to connect to database:', error);
            res.status(500).send('Failed to connect to database');
        }
    });

    /*Routers*/

    const baseRouter = require("./routes/base.router")
    const productsRouter = require("./routes/products.router")
    const cartsRouter = require("./routes/carts.router")
    const chatRouter = require("./routes/chat.router")
    const sessionsRouter = require("./routes/sessions.router")

    app.get("/", checkAuth, async (req, res) => {

        res.render("home", { page: "home" })

    })



    app.use("/", baseRouter)
    app.use("/api/products", productsRouter.router)
    app.use("/api/carts", cartsRouter)
    app.use("/api/chat", chatRouter)
    app.use("/api/sessions", sessionsRouter)

    /*server launchment*/

    server.listen(port, () => {
        console.log(`Server started on http://localhost:${port}`)
    })

}

