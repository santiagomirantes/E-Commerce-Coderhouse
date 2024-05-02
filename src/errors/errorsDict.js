const errors = [
    /* ["title","message",code] */
    ["updateProductQuantity quantity error","The updateProductQuantity must receive a valid quantity", 1],
    ["updateCart arguments missing","The cartManager.updatecart() function must receive two arguments",2],
    ["addMessage invalid arguments","Invalid arguments passed to MessagesManager.addMessage()",3],
    ["addProduct arguments missing","There are arguments missing to create a new product.",4],
    ["updateProduct arguments missing","The ProductManager.updateProduct() function must receive two arguments",5],
    ["deleteProduct 404","Product not found",6],
    ["addTicket invalid arguments",`Invalid arguments passed to TicketsManager.addTicket`,7],
    ["addTicket unexistent purchaser","Unexistent purchaser user passed to TicketsManager.addTicket",8]
]

function getError(message) {
    const found = errors.find(x => x[1] === message)
    return found === undefined ? [undefined, message, undefined] : found
}

module.exports = {getError}