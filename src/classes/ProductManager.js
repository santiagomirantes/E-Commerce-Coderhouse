class ProductManager {
    constructor() {
        this.URL = "../products/products.json"
        this.fs = require("fs").promises
        this.path = require("path")
        this.uuid = require('uuid');
    }

    error(text) {
        throw new Error(text)
    }

    checkIfEmpty(obj) {
        let toCheck = ["title", "description", "price", "code", "stock", "status", "category"]
        let isEmpty = false
        toCheck.forEach(category => {
            let val = obj[category]
            if (val === undefined || val === null) {
                isEmpty = true
            }
        })
        return isEmpty
    }

    async addProduct(obj) {
        try {
            const isEmpty = this.checkIfEmpty(obj)
            if (isEmpty) {
                return this.error("The addProduct function must contian 7 valid arguments.")
            }

            let products = await this.fs.readFile(this.path.join(__dirname, this.URL), 'utf-8');

            products = JSON.parse(products)

            let sameStock = products.find(x => x.code === obj["code"])

            if (sameStock !== undefined) {
                return this.error("The code given has already been used: " + obj["code"])
            }

            products.push({
                id: this.uuid.v4(),
                ...obj
            })

            await this.fs.writeFile(this.path.join(__dirname, this.URL), JSON.stringify(products), 'utf8')
        }
        catch (err) {
            return this.error("Failed to create the product:" + err)
        }

    }

    async getProducts() {
        try {
            let content = await this.fs.readFile(this.path.join(__dirname, this.URL), 'utf-8');
            let products = JSON.parse(content);
            return products;
        }
        catch (err) {
            return this.error("Failed to get the products: " + err)
        }
    }
    async getProductById(id) {
        try {
            let content = await this.fs.readFile(this.path.join(__dirname, this.URL), 'utf-8');
            let products = JSON.parse(content);
            let found = products.find(x => x.id === parseInt(id))
            return found === undefined ? this.error("Product not found with id " + id) : found
        }
        catch (err) {
            return this.error("Failed to get the products: " + err)
        }
    }

    clean() {
        this.fs.writeFileSync(this.path, "[]", "utf8")
    }

    async updateProduct(id, newObj) {

        try {
            if (id === undefined || newObj === undefined) {
                return this.error("The ProductManager.updateProduct() function must receive two arguments")
            }

            let products = JSON.parse(await this.fs.readFile(this.path.join(__dirname, this.URL), "utf-8"))
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

            await this.fs.writeFile(this.path.join(__dirname,this.URL), JSON.stringify(products), "utf8")

        }
        catch (err) {
           return this.error("Failed to update: " + err)
        }
    }

    async deleteProduct(id) {

        if (typeof id !== "number") {
            return this.error("the id number MUST be a number")
        }

        let products = JSON.parse(await this.fs.readFile(this.path.join(__dirname,this.URL)))
        let oldLength = products.length

        products = products.filter(x => x.id !== id)


        if (products.length === oldLength) {
            return this.error("Couldn´t find any product with the id: " + id)
        }

        this.fs.writeFile(this.path.join(__dirname,this.URL), JSON.stringify(products), "utf8")

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
