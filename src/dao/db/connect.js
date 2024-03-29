const mongoose = require("mongoose")

async function connect() {

const mongoURL = process.env.MONGO_URL

try{
    await mongoose.connect(mongoURL)
    await mongoose.connection.db.admin().command({ ping: 1 });

    console.log("succesfully connected to db")
}
catch(err) {
    return console.error(err)
}

}

module.exports = {connect}