const mongoose = require("mongoose")

const ticketCollection = "tickets"

const ticketSchema = {
    purchase_datetime:String,
    amount:Number,
    purchaser:{type:mongoose.Schema.Types.ObjectId, ref:"users"}
}

let ticketModel

if (mongoose.modelNames().includes(ticketCollection)) {
    ticketModel = mongoose.model(ticketCollection)
}
else {

    ticketModel = new mongoose.model(ticketCollection, ticketSchema)

}

module.exports = ticketModel