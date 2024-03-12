/*imports*/

const express = require("express")
const path = require("path")
const { create } = require("express-handlebars")
const http = require('http');
const { Server } = require('socket.io');
const { ProductsManager } = require("./dao/db/ProductsManager")
const { CartsManager } = require("./dao/db/CartsManager")
const { UsersManager } = require("./dao/db/UsersManager")
const { connect } = require("./dao/db/connect")
const session = require("express-session")
const cookieParser = require("cookie-parser")
const passport = require("passport")
const {initPass,checkAuth} = require("./config/passport")

/*creating the server and working with the imported packages*/

const pm = new ProductsManager()
const cm = new CartsManager()
const um = new UsersManager()
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


/*using*/

app.use(express.static("public"))
app.use(express.json())
// Middleware to connect to the database before accessing the router
app.use(async (req, res, next) => {
    try {
        await connect()
        next()
    } catch (error) {
        console.error('Failed to connect to database:', error);
        res.status(500).send('Failed to connect to database');
    }
});

/*Routers*/

const productsRouter = require("./routes/products.router")
const cartsRouter = require("./routes/carts.router")
const sessionsRouter = require("./routes/sessions.router")

app.get("/",checkAuth, async (req, res) => {

    res.render("home", {page:"home"})

})

app.get("/realtimeproducts", checkAuth, async (req, res) => {
    try {
        res.render("realTimeProducts", {page:"products"})
    }
    catch (err) {
        res.send(err)
    }
})

app.get("/products", checkAuth, async (req, res) => {

    try {
       /* if (req.session.sessionID === undefined) {
            return res.redirect("/login")
        }*/

        console.log("arrived", req.user)


        const user = await um.login({
            email: req.user.email,
            password: req.user.password
        })

        const products = await pm.getProducts({}, 0, 5, null)
        const cartID = "65de29cc1887c456fbbca05c"
        res.render("products", {
            page:"products",
            products: products.payload,
            cart: cartID,
            user
        })
    }
    catch {
        err => {
            res.status(500).json({ error: err })
        }
    }
})
app.get("/cart", checkAuth, async (req, res) => {
    const cartID = "65de29cc1887c456fbbca05c"

    try {
        const cart = await cm.getCartById(cartID)
        const products = []

        for (let id in cart.products) {
            id = cart.products[id].toString()

            products.push(await pm.getProductById(id))
        }
        res.render("cart", { page:"cart", products })
    }
    catch (err) {
        res.status(404).json({ error: err })
    }

})

app.get("/register", async (req, res) => {
    res.render("register", {page:"register"})
})

app.get("/login", async (req, res) => {
    res.render("login", {page:"login"})
})

app.get("/profile", checkAuth, async (req, res) => {


    try {


        const user = await um.login({
            email: req.user.email,
            password: req.user.password
        })

        res.render("profile", { user, page:"profile" })
    }
    catch (err) {
        res.status(404).json({ error: err.message })
    }
})

app.use("/api/products", productsRouter.router)
app.use("/api/carts", cartsRouter)
app.use("/api/sessions", sessionsRouter)

/*server launchment*/

server.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`)
})