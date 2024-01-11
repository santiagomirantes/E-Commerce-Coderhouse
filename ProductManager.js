class ProductManager {
    constructor() {
        this.path = "products.json"
        this.fs = require("fs")
    }

    error(text) {
        throw new Error(text)
    }

    checkIfEmpty(obj) {
        let toCheck = ["title", "description", "price", "thumbnail", "code", "stock"]
        let isEmpty = false
        toCheck.forEach(category => {
            let val = obj[category]
            if (val === undefined || val === null) {
                isEmpty = true
            }
        })
        return isEmpty
    }

    addProduct(obj) {
        const isEmpty = this.checkIfEmpty(obj)
        if (isEmpty) {
            return this.error("The addProduct function must contian 6 valid arguments.")
        }

        let products = this.fs.readFileSync(this.path)

        products = JSON.parse(products)

        let sameStock = products.find(x => x.code === obj["code"])

        if (sameStock !== undefined) {
            return this.error("The code given has already been used: " + obj["code"])
        }

        products.push({
            id: products.length,
            ...obj
        })

        this.fs.writeFileSync(this.path, JSON.stringify(products), "utf8")

    }

    getProducts() {
        let products = JSON.parse(this.fs.readFileSync(this.path))
        return products
    }
    getProductById(id) {
        let products = JSON.parse(this.fs.readFileSync(this.path))
        let found = products.find(x => x.id === id)
        return found === undefined ? this.error("Product not found with id " + id) : found
    }

    clean() {
        this.fs.writeFileSync(this.path, "[]", "utf8")
    }

    updateProduct(id, newObj) {
        if (id === undefined || newObj === undefined) {
            return this.error("The ProductManager.updateProduct() function must receive two arguments")
        }

        let products = JSON.parse(this.fs.readFileSync(this.path))
        let found = products.find(x => x.id === id)

        if (found === undefined) {
            return this.error("Couldn´t find any product with the following id: " + id)
        }

        let entries = Object.entries(newObj)

        entries.forEach(change => {

            let key = change[0]
            let val = change[1]

            if (key === "id") {
                return this.error("Cannot change the id field.")
            }

            found[key] = val

        })

        this.fs.writeFileSync(this.path, JSON.stringify(products), "utf8")
    }

    deleteProduct(id) {

       if(typeof id !== "number") {
          return this.error("the id number MUST be a number")
       }

       let products = JSON.parse(this.fs.readFileSync(this.path))
       let oldLength = products.length

       products = products.filter(x => x.id !== id)


       if(products.length === oldLength) {
        return this.error("Couldn´t find any product with the id: " + id)
       }

       this.fs.writeFileSync(this.path, JSON.stringify(products), "utf8")

    }


}

/*const pm = new ProductManager()

pm.addProduct({
    title:"Test product 3",
    description:"A test product 3",
    price:3100,
    thumbnail:"media/someimage3.png",
    code:3,
    stock:7
})*/

module.exports = { ProductManager }
