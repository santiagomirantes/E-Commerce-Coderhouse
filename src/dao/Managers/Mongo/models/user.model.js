const mongoose = require("mongoose")
const mongoosePaginate = require("mongoose-paginate-v2")

const userCollection = "users"

const userSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: {
        type: String,
        unique: true
    },
    age: Number,
    password: String,
    role:String
})

let userModel

userSchema.plugin(mongoosePaginate)

if (mongoose.modelNames().includes(userCollection)) {
    userModel = mongoose.model(userCollection)
}
else {

    userModel = new mongoose.model(userCollection, userSchema)

}

module.exports = userModel