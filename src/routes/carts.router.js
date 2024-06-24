const { checkAuth } = require("../config/passport")
const { CartsRepository, ProductsRepository, UsersRepository, TicketsRepository } = require("../dao/factory")
const {CustomError} = require("../errors/CustomError")
const {getError} = require("../errors/errorsDict")
const express = require("express")
const router = express.Router()


router.get("/", async (req, res) => {

    try {
        const carts = await CartsRepository.getCarts()

        res.send(carts)
    }
    catch (err) {
        err = new CustomError(getError(err.message))
        req.logger.error(err)
        res.status(500).send({ error: err.message })

    }

})

router.get("/:id", async (req, res) => {
    const id = req.params.id

    try {
        const cart = await CartsRepository.getCartById(id)

        res.send(cart)
    }
    catch (err) {
        err = new CustomError(getError(err.message))
        req.logger.error(err)
        res.status(401).send({ error: err.message })
    }
})
router.post("/", async (req, res) => {
    const obj = req.body

    try {
        await CartsRepository.createCart(obj)
        res.send({status:"success"})
    }
    catch (err) {
        err = new CustomError(getError(err.message))
        req.logger.error(err)
        res.status(401).json({ error: err.message })
    }
})

router.post("/:cid/products/:pid", async (req, res) => {

    const cid = req.params.cid
    const pid = req.params.pid

    console.log(req.user)


    try {
        await CartsRepository.addProduct(cid, pid)
        res.send({status:"success"})
    }
    catch (err) {
        err = new CustomError(getError(err.message))
        req.logger.error(err)
        res.status(401).json({ error: err.message })
    }

})

router.put("/:cid", async (req, res) => {

    const cid = req.params.cid
    const products = req.body.products

    try {
        await CartsRepository.updateProducts(cid, products)
        res.send({status:"success"})
    }
    catch (err) {
        err = new CustomError(getError(err.message))
        req.logger.error(err)
        res.status(500).json({ error: err.message })
    }

})

router.put("/:cid/products/:pid/quantity/:quantity", async (req, res) => {

    const cid = req.params.cid
    const pid = req.params.pid
    const quantity = req.params.quantity

    try {

        await CartsRepository.updateProductQuantity(cid, pid, quantity)
        res.send({status:"success"})

    }
    catch (err) {
        err = new CustomError(getError(err.message))
        req.logger.error(err)
        res.status(401).json({ error: err.message })
    }

})

router.delete("/:cid", async (req, res) => {

    const cid = req.params.cid

    try {
        await CartsRepository.deleteCartProducts(cid)
        res.send({status:"success"})
    }
    catch (err) {
        err = new CustomError(getError(err.message))
        req.logger.error(err)
        res.status(500).json({ error: err.message })
    }

})

router.delete("/:cid/products/:pid", async (req, res) => {


    const cid = req.params.cid
    const pid = req.params.pid

    try {
        await CartsRepository.deleteProductFromCart(cid, pid)
        res.send({status:"success"})
    }
    catch (err) {
        err = new CustomError(getError(err.message))
        req.logger.error(err)
        res.status(401).json({ error: err.message })
    }
})

router.get("/:cid/purchase", checkAuth, async (req, res) => {

    const cid = req.params.cid

    try {
        const cart = await CartsRepository.getCartById(cid)
        const cantBuy = []
        let amount = 0

        for (const prodID of cart.products) {
            const prod = await ProductsRepository.getProductById(prodID.toString())
            const stock = prod.stock - 1
            if (stock === -1) {
                cantBuy.push(prodID)
            }
            else {
                await ProductsRepository.updateProduct(prodID, {stock})
                amount += prod.price
            }
        }

        const user = await UsersRepository.login({
            email:req.user.email,
            password:req.user.password
        })

        const ticket = await TicketsRepository.createTicket({
            amount,
            purchaser:user._id
        })

        await CartsRepository.updateCart(cid,{
            products:cantBuy
        })

        res.send({ticket})
        
    }
    catch (err) {
        err = new CustomError(getError(err.message))
        req.logger.error(err)
        res.status(500).send()
    }
})

module.exports = router