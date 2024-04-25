class CartsRepository {
    constructor(CartsManager, CartDTO) {
        this.CartsManager = new CartsManager()
        this.CartDTO = CartDTO
    }

    async createCart(obj) {
        obj = new this.CartDTO(obj)
        return await this.CartsManager.createCart(obj)
    }

    async getCarts() {
        return await this.CartsManager.getCarts()
    }

    async getCartById(id) {
        return await this.CartsManager.getCartById(id)
    }

    async addProduct(cid,pid) {
        return await this.CartsManager.addProduct(cid,pid)
    }

    async updateProducts(cid,newProds) {
        return await this.CartsManager.updateProducts(cid,newProds)
    }

    async updateProductQuantity(cid,pid,quantity) {
        return await this.CartsManager.updateProductQuantity(cid,pid,quantity)
    }

    async updateCart(id,newObj) {
         newObj = new this.CartDTO(newObj)
         return await this.CartsManager.updateCart(id,newObj)
    }

    async deleteCartProducts(cid) {
        return await this.CartsManager.deleteCartProducts(cid)
    }

    async deleteProductFromCart(cid,pid) {
        return await this.CartsManager.deleteProductFromCart(cid,pid)
    }

    

}

module.exports = CartsRepository