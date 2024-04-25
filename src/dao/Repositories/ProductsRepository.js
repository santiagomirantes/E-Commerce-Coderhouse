class ProductsRepository{
    constructor(ProductsManager,ProductDTO) {
        this.ProductsManager = new ProductsManager()
        this.ProductDTO = ProductDTO
    }

    checkIfEmpty(obj) {
        return this.ProductsManager.checkIfEmpty(obj)
    }

    async addProduct(obj) {
        obj = new this.ProductDTO(obj)
        return await this.ProductsManager.addProduct(obj)
    }

    async getProducts(query,page,limit,sort) {
       return await this.ProductsManager.getProducts(query,page,limit,sort)
    }

    async getProductById(id) {
        return await this.ProductsManager.getProductById(id)
    }

    async updateProduct(id, newObj) {
        return await this.ProductsManager.updateProduct(id,newObj)
    }

    async deleteProduct(id) {
        return await this.ProductsManager.deleteProduct(id)
    }
}

module.exports = ProductsRepository