const express = require("express")
const app = express()
const path = require("path")
const port = 8080

/*Routers*/

const productsRouter = require("./routes/products.router")
const cartsRouter = require("./routes/carts.router")

app.use(express.static("public"))
app.use(express.json())

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
})

app.use("/api/products", productsRouter)
app.use("/api/carts", cartsRouter)

app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`)
})