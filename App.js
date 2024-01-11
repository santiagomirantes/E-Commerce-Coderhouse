const { ProductManager } = require("./ProductManager");
const pm = new ProductManager()

const express = require("express")
const app = express()
const port = 8080

app.get("/", (req,res) => {
    res.send("Hello!")
})

app.get("/products", (req,res) => {
   const params = req.query.limit
   const products = pm.getProducts()
   let limit
   if(params < 0 || params === undefined || isNaN(parseInt(params))) {
       limit = products.length
   }
   else{
     limit = parseInt(params)
   }
   const obj = {
    products:products.slice(0,limit)
   }

   res.send(JSON.stringify(obj))

})

app.get("/products/:id", (req,res) => {
    const id = req.params.id
    try{
        const product = pm.getProductById(id)
        res.send(JSON.stringify(product))
    }
    catch(err) {
      res.send("Couldn´t find a product with id: " + id)
    }

})

app.listen(port,() => {
    console.log(`Server started on http://localhost:${port}`)
})