const mongoose = require("mongoose")

        const userCollection = "users"

        const userSchema = new mongoose.Schema({
            first_name: String,
            last_name: String,
            email: {
                type: String,
                unique: true
            }
        })

        const userModel = new mongoose.model(userCollection, userSchema)

        return userModel




module.exports = userModel