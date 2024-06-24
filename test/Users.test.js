require("dotenv").config()
const mongoose = require("mongoose")
const assert = require("assert").strict
let userModel
let chai


async function connect() {

chai = await import("chai")
const mongoURL = process.env.MONGO_URL

try{
    await mongoose.connect(mongoURL)
    await mongoose.connection.db.admin().command({ ping: 1 });

    console.log("succesfully connected to db")
    return
}
catch(err) {
    return console.error(err)
}

}
    describe("Testing Users", () => {
        before(async function() {
            await connect()
            userModel = require("../src/dao/Managers/Mongo/models/user.model")
        })
        beforeEach(function() {
            this.timeout(5000)
        })
        it("se debe obtener un usuario", async () => {
            const result = await userModel.find()
            chai.expect(Array.isArray(result)).to.assert
        })
    })