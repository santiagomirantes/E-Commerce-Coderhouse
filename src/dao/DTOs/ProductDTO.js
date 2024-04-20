class ProductDTO{
    constructor(product) {
        this.title = String(product.title)
        this.description = String(product.description)
        this.price = isNaN(parseInt(product.price)) ? undefined : parseInt(product.price)
        this.code = isNaN(parseInt(product.code)) ? undefined : parseInt(product.code)
        this.thumbnail = String(this.thumbnail)
        this.stock = isNaN(parseInt(product.stock)) ? undefined : parseInt(product.stock)
        this.status = !!this.status
        this.category = String(product.category)
    }
}

module.exports = {ProductDTO}