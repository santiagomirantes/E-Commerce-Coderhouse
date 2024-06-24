const mongoose = require("mongoose")
const mongoosePaginate = require("mongoose-paginate-v2")


const productCollection = "products"

const productSchema = new mongoose.Schema({
    title: String,
    description: String,
    price: Number,
    code: Number,
    thumbnail: String,
    stock: Number,
    status: Boolean,
    category: String,
    owner: String, //email
    image: String
})

let productModel

productSchema.plugin(mongoosePaginate)

if (mongoose.modelNames().includes(productCollection)) {
    productModel = mongoose.model(productCollection)
}
else {

    productModel = new mongoose.model(productCollection, productSchema)

}


module.exports = productModel