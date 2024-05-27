const { ProductsRepository, UsersRepository } = require("../dao/factory");
const express = require("express")
const {checkAuth} = require("../config/passport")
const {CustomError} = require("../errors/CustomError")
const {getError} = require("../errors/errorsDict")

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

router.post("/", async (req, res) => {
    const obj = req.body

    try {
        await ProductsRepository.addProduct(obj)
        res.send({status:"success"})
    }
    catch (err) {
        err = new CustomError(getError(err.message))
        req.logger.error(err)
        res.status(400).json({ error: err.message })
    }
})

router.put("/:id", async (req, res) => {

    const obj = req.body
    const id = req.params.id

    try {
        await ProductsRepository.updateProduct(id, obj)
        res.send({status:"success"})
    }
    catch (err) {
        err = new CustomError(getError(err.message))
        req.logger.error(err)
        res.status(400).json({ error: err.message })
    }
})

router.delete("/:id",checkAuth, async (req, res) => {


    const id = req.params.id

    try {
        const user = await UsersRepository.login({
            email: req.user.email,
            password: req.user.password
        })

        if (user.role === "admin") {
            await ProductsRepository.deleteProduct(id)
        }

        res.send({status:"success"})
    }
    catch (err) {
        err = new CustomError(getError(err.message))
        req.logger.error(err)
        res.status(400).json({ error: err.message })
    }

})

module.exports = { router, setupIO }