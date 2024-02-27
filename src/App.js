/*imports*/

const express = require("express")
const path = require("path")
const {create} = require("express-handlebars")
const http = require('http');
const {Server} = require('socket.io');
const {ProductsManager} = require("./dao/db/ProductsManager")
const {connect} = require("./dao/db/connect")

/*creating the server and working with the imported packages*/

const pm = new ProductsManager()
const app = express()
const port = 8080 || process.env.PORT
const server = http.createServer(app)
const io = new Server(server)


/*handlebars*/

const hbs = create({
    helpers:{
        foo() {return "hey"}
    }
})

app.engine("handlebars",hbs.engine)
app.set("view engine","handlebars")
app.set('views', path.join(__dirname,"views"));

/*socket io*/

io.on('connection', (socket) => {
    console.log('Nuevo usuario conectado');

    //this is for the products.route management of messages

    productsRouter.setupIO(socket)

    socket.emit("connection","")
  
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

app.get("/", async (req, res) => {
    
    try{
        const products = await pm.getProducts()
        res.render("home",{
            products
        })
    }
    catch{err => {
        res.status(500).json({error:err})
    }}
    
})

app.get("/realtimeproducts", async (req,res) => {
    try{
        res.render("realTimeProducts",{})
    }
    catch(err) {
        res.send(err)
    }
})

app.use("/api/products", productsRouter.router)
app.use("/api/carts", cartsRouter)

/*server launchment*/

server.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`)
})