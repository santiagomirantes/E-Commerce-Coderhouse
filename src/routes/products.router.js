const { ProductsRepository, UsersRepository } = require("../dao/factory");
const express = require("express")
const { checkAuth } = require("../config/passport")
const { CustomError } = require("../errors/CustomError")
const { getError } = require("../errors/errorsDict")

const router = express.Router()

let socket

const setupIO = async (received) => {

    socket = received


    const products = await ProductsRepository.getProducts()
    socket.emit('update', products);

    socket.on('disconnect', () => {
        console.log('User disconnected from the products route');
    });
};





router.get("/", async (req, res) => {
    try {

        const query = req.query.query === undefined ? {} : JSON.parse(req.query.query)
        const page = req.query.page === undefined ? 0 : parseInt(req.query.page)
        const limit = req.query.limit === undefined ? 10 : parseInt(req.query.limit)
        const sort = req.query.sort


        const products = await ProductsRepository.getProducts(query, page, limit, sort)


        res.send(JSON.stringify(products))

    }
    catch (err) {
        err = new CustomError(getError(err.message))
        req.logger.error(err)
        res.status(500).json({ error: err.message })
    }
})

router.get("/:id", async (req, res) => {
    const id = req.params.id
    try {
        const product = await ProductsRepository.getProductById(id)
        res.send(JSON.stringify(product))
    }
    catch (err) {
        err = new CustomError(getError(err.message))
        req.logger.error(err)
        res.status(404).json({ error: err.message })
    }

})

router.post("/", checkAuth, async (req, res) => {
    const obj = req.body
    if (req.user !== undefined) {
        const user = await UsersRepository.login({
            email: req.user.email,
            password: req.user.password
        })
        if (user.role === "premium" || user.role === "admin") {
            obj.owner = req.user.email
        }
        else{
            res.status(401).json({error:"Invalid username role"})
        }
    }
    else{
        res.status(401)
    }

    try {
        await ProductsRepository.addProduct(obj)
        res.send({ status: "success" })
    }
    catch (err) {
        err = new CustomError(getError(err.message))
        req.logger.error(err)
        res.status(400).json({ error: err.message })
    }
})

router.put("/:id", checkAuth, async (req, res) => {

    const obj = req.body
    const id = req.params.id

    try {
        const user =  await UsersRepository.login({
            email:req.user.email,
            password:req.user.password
        })
        const p = await ProductsRepository.getProductById(id)
        if(user.role === "admin" || (user.role === "premium" && p.owner === user.email)) {
            await ProductsRepository.updateProduct(id, obj)
            res.send({ status: "success" })
        }
        else{
            res.status(401).json({error:"Unforbidden"})
        }
    
    }
    catch (err) {
        err = new CustomError(getError(err.message))
        req.logger.error(err)
        res.status(400).json({ error: err.message })
    }
})

router.delete("/:id", checkAuth, async (req, res) => {


    const id = req.params.id

    try {
        const user = await UsersRepository.login({
            email: req.user.email,
            password: req.user.password
        })

        const p = await ProductsRepository.getProductById(id)

        if (user.role === "admin" || (user.role === "premium" && p.owner === user.email)) {
            await ProductsRepository.deleteProduct(id)
            res.send({ status: "success" })
        }
        else{
            res.status(401).json({error:"Unforbidden"})
        }

    }
    catch (err) {
        err = new CustomError(getError(err.message))
        req.logger.error(err)
        res.status(400).json({ error: err.message })
    }

})

module.exports = { router, setupIO }