const mongoose = require("mongoose")

const messageCollection = "messages"

const messageSchema = {
    /*{type:mongoose.Schema.Types.ObjectId, ref:"products"}*/
    from:{type:mongoose.Schema.Types.ObjectId, ref:"users"},
    content:String,
    timestamp:String
}

let messageModel

if (mongoose.modelNames().includes(messageCollection)) {
    messageModel = mongoose.model(messageCollection)
}
else {

    messageModel = new mongoose.model(messageCollection, messageSchema)

}

module.exports = messageModel