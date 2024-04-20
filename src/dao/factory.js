const config = require("../config/persistency")

const toExport = {}

let UsersManager = null

switch(config.persistency) {
    case "MONGO":
       UsersManager = require("./Managers/Mongo/UsersManager").UsersManager
       toExport.CartsManager = require("./Managers/Mongo/CartsManager").CartsManager
       toExport.ProductsManager = require("./Managers/Mongo/ProductsManager").ProductsManager
       break
    case "MEMORY":
        UsersManager = require("./Managers/Memory/UsersManager").UsersManager
        toExport.CartsManager = require("./Managers/Memory/CartsManager").CartsManager
        toExport.ProductsManager = require("./Managers/Memory/ProductsManager").ProductsManager
        break
}

toExport.persistency = config.persistency

/*users*/

//TODO: create repositories for the products and the carts model

const UserDTO = require("./DTOs/UserDTO").UserDTO
toExport.UsersRepository = require("./Repositories/UserRepository")
toExport.UsersRepository = new toExport.UsersRepository(UsersManager,UserDTO)

toExport.ProductDTO = require("./DTOs/ProductDTO").ProductDTO


module.exports = toExport