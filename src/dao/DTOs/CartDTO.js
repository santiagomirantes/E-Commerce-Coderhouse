class CartDTO{
    constructor(cart) {
        this.products = Array.from(cart.products)
    }
}

module.exports = {CartDTO}