const { ProductsRepository, UsersRepository, CartsRepository, MessagesRepository } = require("../dao/factory");
const { RestrictedUserDTO } = require("../dao/DTOs/RestrictedUserDTO")
const express = require("express")
const { checkAuth } = require("../config/passport");
const Mocks = require("../mocks/Mocks")
const fs = require("fs").promises
const path = require("path")

const router = express.Router()

router.get("/realtimeproducts", checkAuth, async (req, res) => {
    try {
        res.render("realTimeProducts", { page: "products" })
    }
    catch (err) {
        res.send(err)
    }
})

router.get("/products", checkAuth, async (req, res) => {

    try {
        /* if (req.session.sessionID === undefined) {
             return res.redirect("/login")
         }*/

        req.logger.info("arrived", req.user)


        const user = await UsersRepository.login({
            email: req.user.email,
            password: req.user.password
        })

        const products = await ProductsRepository.getProducts({}, 0, 5, null)
        const cartID = user.cart
        res.render("products", {
            page: "products",
            products: products.payload,
            cart: cartID,
            user,
            isUser: user.role !== "admin",
            isPremium:user.role === "premium"
        })
    }
    catch {
        err => {
            res.status(500).json({ error: err })
        }
    }
})
router.get("/products/:pid", checkAuth, async (req, res) => {

    try {
        /* if (req.session.sessionID === undefined) {
             return res.redirect("/login")
         }*/

        const pid = req.params.pid


        const user = await UsersRepository.login({
            email: req.user.email,
            password: req.user.password
        })

        const product = await ProductsRepository.getProductById(pid)


        const cartID = user.cart
        res.render("productById", {
            page: "productById",
            product,
            productExists: product !== null,
            cart: cartID,
            user: new RestrictedUserDTO(user),
            isAdmin: user.role === "admin",
            isPremium: user.role === "premium",
            isOwner: product.owner === user.email
        })
    }
    catch (err) {
        res.status(500).json({ error: err.message })
    }
})
router.get("/cart", checkAuth, async (req, res) => {

    try {

        const user = await UsersRepository.login({
            email: req.user.email,
            password: req.user.password
        })
        const cartID = user.cart
        const cart = await CartsRepository.getCartById(cartID)
        const products = []

        for (let id in cart.products) {
            id = cart.products[id].toString()

            const prod = await ProductsRepository.getProductById(id)
           if(prod === null) {
               await CartsRepository.deleteProductFromCart(cartID,id)
           }
           else{
            prod.id = id
            products.push(prod)
           }
        }

        res.render("cart", {
            page: "cart",
            cart: cartID,
            hasProducts: products.length > 0,
            products,
            productsJSON: encodeURIComponent(JSON.stringify(products))
        })
    }
    catch (err) {
        res.status(404).json({ error: err.message })
    }

})

router.get("/register", async (req, res) => {
    res.render("register", { page: "register" })
})

router.get("/login", async (req, res) => {
    res.render("login", { page: "login" })
})

router.get("/profile", checkAuth, async (req, res) => {


    try {


        const user = await UsersRepository.login({
            email: req.user.email,
            password: req.user.password
        })

        res.render("profile", { user, page: "profile" })
    }
    catch (err) {
        res.status(404).json({ error: err.message })
    }
})

router.get("/current", checkAuth, async (req, res) => {
    try {
        const user = await UsersRepository.login({
            email: req.user.email,
            password: req.user.password
        })

        res.send(new RestrictedUserDTO(user))
    }
    catch (err) {
        res.status(500).json({ error: err.message })
    }
})

router.get("/modifyproduct/:pid", checkAuth, async (req, res) => {
    const pid = req.params.pid
    try {
        const user = await UsersRepository.login({
            email: req.user.email,
            password: req.user.password
        })

        if (user.role !== "admin" && user.role !== "premium") {
            return res.redirect("/products")
        }

        const product = await ProductsRepository.getProductById(pid)

        if(user.role === "premium" && product.owner !== req.user.email) {
            return res.redirect("/products")
        }

        res.render("modifyProduct", { page: "modifyProduct", product })

    }
    catch (err) {
        req.logger.fatal(err)
        res.status(500).json({ error: err.message, product })
    }
})

router.get("/addproduct", checkAuth, async (req, res) => {
    try {
        const user = await UsersRepository.login({
            email: req.user.email,
            password: req.user.password
        })


        if (user.role !== "admin" && user.role !== "premium") {
            return res.redirect("/products")
        }

        res.render("addProduct", { page: "addProduct"})
    }
    catch (err) {
        req.logger.fatal(err)
        res.status(500).send({ json: err.message })
    }
})

router.get("/chat", checkAuth, async (req, res) => {
    try {
        const user = await UsersRepository.login({
            email: req.user.email,
            password: req.user.password
        })
        const messages = await MessagesRepository.getMessages()
        for (const obj of messages) {
            obj.from = await UsersRepository.getUsernameById(obj.from.toString())
            if (obj.from === user.first_name + user.last_name) {
                obj.from = "You"
            }
            obj.date = new Date(Number(obj.timestamp))
            obj.date = `${obj.date.getDate()}/${obj.date.getMonth() + 1}/${obj.date.getFullYear()} ${obj.date.getHours()}:${obj.date.getMinutes()}`
        }
        res.render("chat", { page: "chat", messages, hasMessages: messages.length > 0, isAdmin: user.role === "admin" })
    }
    catch (err) {
        req.logger.fatal(err)
        res.status(500).send({ json: err.message })
    }
})

const mocks = new Mocks()

router.get("/mockingproducts", async (req,res) => {
    try{
       const products = []
       for(let i = 0; i < 100; i++) {
         products.push(mocks.generateProduct())
       }
       res.send(products)
    }
    catch(err) {
        req.logger.fatal(err)
        res.status(500).json({error:err.message})
    }
})

router.get("/loggerTest", async (req,res) => {
    req.logger.debug("this is the less important log")
    req.logger.http("An http log")
    req.logger.info("This will show in production")
    req.logger.warning("Warning!!")
    req.logger.error("Some random error")
    req.logger.fatal("A fatal error, kill the server")
    res.send("success")
})

router.get("/forgotpassword", async (req,res) => {
    res.render("forgotPassword",{page:"forgotPassword"})
})

router.get("/modifypassword/:email", async (req,res) => {
    const email = decodeURIComponent(req.params.email)
    try{
      const route = path.join(__dirname,"../dao/emails/",email)
      const content = await fs.readFile(route,"utf-8")
      if(content !== "checked") {
         return res.redirect("/login")
      }
      res.render("modifyPassword", {page:"modifyPassword", email})
    }
    catch(err) {
        res.redirect("/login")
    }
})

module.exports = router