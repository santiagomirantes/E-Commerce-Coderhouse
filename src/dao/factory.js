const config = require("../config/persistency")

const toExport = {}

let UsersManager = null
let CartsManager = null
let MessagesManager = null
let ProductsManager = null
let TicketsManager = null

switch(config.persistency) {
    case "MONGO":
       UsersManager = require("./Managers/Mongo/UsersManager").UsersManager
       CartsManager = require("./Managers/Mongo/CartsManager").CartsManager
       MessagesManager = require("./Managers/Mongo/MessagesManager").MessagesManager
       ProductsManager = require("./Managers/Mongo/ProductsManager").ProductsManager
       TicketsManager = require("./Managers/Mongo/TicketsManager").TicketsManager
       break
    case "MEMORY":
        UsersManager = require("./Managers/Memory/UsersManager").UsersManager
        CartsManager = require("./Managers/Memory/CartsManager").CartsManager
        ProductsManager = require("./Managers/Memory/ProductsManager").ProductsManager
        break
}

toExport.persistency = config.persistency


const UserDTO = require("./DTOs/UserDTO").UserDTO
toExport.UsersRepository = require("./Repositories/UsersRepository")
toExport.UsersRepository = new toExport.UsersRepository(UsersManager,UserDTO)

const ProductDTO = require("./DTOs/ProductDTO").ProductDTO
toExport.ProductsRepository = require("./Repositories/ProductsRepository")
toExport.ProductsRepository = new toExport.ProductsRepository(ProductsManager,ProductDTO)

const CartDTO = require("./DTOs/CartDTO").CartDTO
toExport.CartsRepository = require("./Repositories/CartsRepository")
toExport.CartsRepository = new toExport.CartsRepository(CartsManager,CartDTO)

const MessageDTO = require("./DTOs/MessageDTO").MessageDTO
toExport.MessagesRepository = require("./Repositories/MessagesRepository")
toExport.MessagesRepository = new toExport.MessagesRepository(MessagesManager,MessageDTO)

const TicketDTO = require("./DTOs/TicketDTO").TicketDTO
toExport.TicketsRepository = require("./Repositories/TicketsRepository")
toExport.TicketsRepository = new toExport.TicketsRepository(TicketsManager,TicketDTO)

module.exports = toExport