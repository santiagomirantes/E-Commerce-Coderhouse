class CartsManager {

    constructor() {
        this.fs = require("fs").promises
        this.path = require("path")
        this.URL = "../../products/carts.json"
        this.prodsURL = "../products/products.json"
        this.uuid = require("uuid")
    }

    error(text) {
        throw new Error(text)
    }

    async createCart(obj) {

        if (obj === undefined || obj === null) {
            return this.error("The createCart function must receive an obj")
        }

        if (!Array.isArray(obj.products)) {
            return this.error("The obj passed to createCart must have an array of products")
        }

        const arr = JSON.parse(await this.fs.readFile(this.path.join(__dirname, this.URL), "utf-8"))

        obj.id = this.uuid.v4()

        arr.push(obj)

        await this.fs.writeFile(this.path.join(__dirname, this.URL), JSON.stringify(arr), "utf-8")

    }

    async getCart(id) {

        const arr = JSON.parse(await this.fs.readFile(this.path.join(__dirname, this.URL), "utf-8"))
        const found = arr.find(x => x.id === id)

        return found === undefined ? this.error("Couldn´t find any cart with the id: " + id) : found

    }

    async addProduct(cid, pid, obj) {

        /*obj should be:
        {
            quantity: quantity of products
        }
        */

        if(typeof obj !== "object") {
            return this.error("The addProduct function must receive an obj")
        }
        else if(typeof obj.quantity !== "number") {
           return this.error("The addProduct function must receive an obj with a quantity property (number)")
        }

        const cartsArr = JSON.parse(await this.fs.readFile(this.path.join(__dirname, this.URL), "utf-8"))
        const prodsArr = JSON.parse(await this.fs.readFile(this.path.join(__dirname, this.prodsURL), "utf-8"))

        const foundCart = cartsArr.find(x => x.id === cid)

        if (foundCart === undefined) {
            return this.error("Couldn´t find any cart with the id: " + cid)
        }

        const foundProd = prodsArr.find(x => x.id === pid)

        if (foundProd === undefined) {
            return this.error("Couldn´t find any product with the id: " + pid)
        }

        const foundProdInsideCart = foundCart.products.find(x => x.id === pid)

        if (foundProdInsideCart === undefined) {

            foundCart.products.push({
                id:pid,
                quantity:obj.quantity
            })

        }
        else {

            foundProdInsideCart.quantity += obj.quantity

        }

        await this.fs.writeFile(this.path.join(__dirname, this.URL), JSON.stringify(cartsArr), "utf-8")


    }

    async updateCart(id, obj) {

        if (!Array.isArray(obj.products)) {
            return this.error("The obj passed to createCart must have an array of products")
        }



    }



}

module.exports = { CartsManager }