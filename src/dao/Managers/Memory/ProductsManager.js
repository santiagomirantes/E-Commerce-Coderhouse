class ProductsManager {

    constructor() {
        this.products = []
        this.lastId = -1
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

    addProduct(obj) {

        let isEmpty = this.checkIfEmpty(obj)

        if (isEmpty) {

            throw new Error("There are arguments missing to create a new product.")
        }

        try {

            if (typeof obj.id !== "number") {
                this.lastId++
                obj.id = this.lastId
            }
            this.products.push(obj)
            return obj

        }
        catch (err) {
            throw new Error(err)
        }




    }

    getProducts(query, page, limit, sort) {

        try {


            const queryFn = (obj) => {
                let status = true
                for (const [key, value] of Object.entries(query)) {
                    status ? status = obj[key] === value : status = false
                }
                return status
            }

            let result = this.products.filter(x => queryFn(x)).slice(limit * page, limit * page + limit)

            if (sort === "desc") {
                result = result.sort((a, b) => b.id - a.id)
            }
            else {
                result = result.sort((a, b) => a.id - b.id)
            }

            const totalPages = Math.ceil(this.products.length / limit)
            const hasPrevPage = page !== 0
            const hasNextPage = page * limit + limit < this.products.length
            const prevPage = hasPrevPage ? page - 1 : null
            const nextPage = hasNextPage ? page + 1 : null
            const prevLink = hasPrevPage ? `/api/products?page=${prevPage}&limit=${limit}` : null;
            const nextLink = hasNextPage ? `/api/products?page=${nextPage}&limit=${limit}` : null;

            return {
                status: "success",
                payload: result,
                totalPages,
                hasPrevPage,
                hasNextPage,
                prevPage,
                nextPage,
                prevLink,
                nextLink
            }

        }
        catch (err) {
            throw new Error(err)
        }

    }

    getProductById(id) {

        try {

            const products = this.products.find(x => x.id === id)

            return products
        }
        catch (err) {
            throw new Error(err)
        }

    }

    updateProduct(id, newObj) {

        try {

            if (id === undefined || newObj === undefined) {
                throw new Error("The ProductManager.updateProduct() function must receive two arguments")
            }


            const product = this.products.find(x => x.id === id)

            if (product === undefined) {
                throw new Error("Couldn´t find any product with the following id: " + id)
            }

            this.deleteProduct(id)
            try {
                const modified = { ...product }
                for (const [key, value] of Object.entries(newObj)) {
                    modified[key] = value
                }
                this.addProduct(modified)
            }
            catch (err) {
                this.products.push(product)
            }

            return product



        }
        catch (err) {
            throw new Error(err)
        }

    }


    deleteProduct(id) {

        try {


            this.products = this.products.filter(x => x.id !== id)

            return

        }
        catch (err) {
            throw new Error(err)
        }

    }



}

module.exports = { ProductsManager }