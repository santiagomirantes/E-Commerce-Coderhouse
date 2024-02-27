const mongoose = require("mongoose")

const cartCollection = "carts"

const cartSchema = {
    products:[{type:mongoose.Schema.Types.ObjectId, ref:"products"}]
}

let cartModel

if (mongoose.modelNames().includes(cartCollection)) {
    cartModel = mongoose.model(cartCollection)
}
else {

    cartModel = new mongoose.model(cartCollection, cartSchema)

}

module.exports = cartModel