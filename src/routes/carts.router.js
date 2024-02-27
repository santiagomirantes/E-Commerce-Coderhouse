const {CartsManager} = require("../dao/db/CartsManager")
const cm = new CartsManager()
const express = require("express")
const router = express.Router()

router.get("/:id",async(req,res) => {
    const id = req.params.id

    try{
        const cart = await cm.getCart(id)

        res.send(cart)
    }
    catch(err) {
        res.status(401).send({error:err.message})
    }
})
router.post("/", async (req,res) => {
    const obj = req.body

    try{
       await cm.createCart(obj)
    }
    catch(err) {
        res.status(401).json({error:err.message})
    }
})
router.post("/:cid/product/:pid", async (req,res) => {
    const body = req.body
    const cid = req.params.cid
    const pid = req.params.pid

    try{
        await cm.addProduct(cid,pid,body)
    }
    catch(err) {
        res.status(401).json({error:err.message})
    }
})

module.exports = router