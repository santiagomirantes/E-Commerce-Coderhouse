const {CartsManager} = require("../dao/db/CartsManager")
const cm = new CartsManager()
const express = require("express")
const router = express.Router()


router.get("/", async(req,res) => {

    try{
        const carts = await cm.getCarts()

        res.send(carts)
    }
    catch(err) {

       res.status(500).send({error:err.message})

    }

})

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

router.post("/:cid/products/:pid", async (req,res) => {

    const cid = req.params.cid
    const pid = req.params.pid 
    

     try{
        await cm.addProduct(cid,pid)
     }
     catch(err) {
        res.status(401).json({error:err.message})
     }

})

router.put("/:cid", async (req,res) => {

    const cid = req.params.cid
    const products = req.body.products

     try{
         await cm.updateProducts(cid,products)
     }
     catch(err) {
        res.status(500).json({erorr:err.message})
     }

})

router.put("/:cid/products/:pid", async (req,res) => {

    const cid = req.params.cid
    const pid = req.params.pid
    const quantity = req.body.quantity

    try{

         await cm.updateProductQuantity(cid,pid,quantity)

    }
    catch(err) {
         res.status(401).json({error:err.message})
    }

})

router.delete("/:cid", async (req,res) => {

    const cid = req.params.cid

    try{
         await cm.deleteCartProducts(cid)
    }
    catch(err) {
        res.status(500).json({error:err.message})
    }

})

router.delete("/:cid/products/:pid", async(req,res) => {

    const cid = req.params.cid
    const pid = req.params.pid

    try{
        await cm.deleteProductFromCart(cid,pid)
    }
    catch(err) {
        res.status(401).json({error:err.message})
    }
})

module.exports = router