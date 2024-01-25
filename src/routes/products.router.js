const { ProductManager } = require("../classes/ProductManager");
const pm = new ProductManager()
const express = require("express")

const router = express.Router()

let socket

const setupIO = async (received) => {

    socket = received
  
  
      // You can emit the current state of your JSON file when a user connects
      const products = await pm.getProducts()
      socket.emit('update', products);
  
      socket.on('disconnect', () => {
        console.log('User disconnected from the products route');
      });
  };

router.get("/", async (req, res) => {
    try {
        const params = req.query.limit
        const products = await pm.getProducts()
        
        let limit
        if (params < 0 || params === undefined || isNaN(parseInt(params))) {
            limit = products.length
        }
        else {
            limit = parseInt(params)
        }
        const obj = {
            products: products.slice(0, limit)
        }

        res.send(JSON.stringify(obj))

    }
    catch(err) {
        console.log(err)
        res.status(500).json({error:err.message})
    }
})

router.get("/:id", async (req, res) => {
    const id = req.params.id
    try {
        const product = await pm.getProductById(id)
        res.send(JSON.stringify(product))
    }
    catch (err) {
        res.status(404).json({error:err.message})
    }

})

router.post("/", async (req,res) => {
    const obj = req.body

    try{
        await pm.addProduct(obj)
        socket.emit("update",await pm.getProducts())
    }
    catch(err) {
        console.log(err)
        res.status(400).json({error:err.message})
    }
})

router.put("/:id", async (req,res) => {

    const obj = req.body
    const id = req.params.id

    try{
        await pm.updateProduct(id,obj)
        socket.emit("update",await pm.getProducts())
    }
    catch(err) {
        res.status(400).json({error:err.message})
    }
})

router.delete("/:id", async (req,res) => {

    const id = req.params.id

    try{
        await pm.deleteProduct(id)
        socket.emit("update",await pm.getProducts())
    }
    catch(err) {
        res.status(400).json({error:err.message})
    }

})

module.exports = {router,setupIO}