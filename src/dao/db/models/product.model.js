const mongoose = require("mongoose")


const productCollection = "products"

const productSchema = new mongoose.Schema({
    title: String,
    description: String,
    price: Number,
    code: Number,
    thumbnail: String,
    stock: Number,
    status: Boolean,
    category: String
})

let productModel

if (mongoose.modelNames().includes(productCollection)) {
    productModel = mongoose.model(productCollection)
}
else {

    productModel = new mongoose.model(productCollection, productSchema)

}


module.exports = productModel