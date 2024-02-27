const mongoose = require("mongoose")

async function connect() {

const mongoURL = "mongodb+srv://santivmirantes:msf0608282020@coderproyect.r4wim2b.mongodb.net/ecommerce?retryWrites=true&w=majority"

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