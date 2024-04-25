class CartsManager {

     constructor() {
          this.cartModel = require("./models/cart.model")
     }

     async createCart(obj) {


          if (!Array.isArray(obj.products)) {
               obj.products = []
          }

          try {


               const cart = new this.cartModel(obj)

               await cart.save()

               return cart


          }
          catch (err) {
               console.error(err)
               throw new Error(err)
          }




     }

     async getCarts() {

          try {

               const carts = await this.cartModel.find({}).lean()

               return carts
          }
          catch (err) {
               console.error(err)
               throw new Error(err)
          }

     }

     async getCartById(id) {

          try {

               const cart = await this.cartModel.findOne({ _id: id })
               
               return cart
          }
          catch (err) {
               console.error(err)
               throw new Error(err)
          }

     }

     async addProduct(cid,pid) {

          try{
              const cart = await this.cartModel.findOne({_id:cid}).lean()
              cart.products.push(pid)

              return await this.updateProducts(cid,cart.products)

          }
          catch(err) {
               throw new Error(err)
          }

     }

     async updateProducts(cid, newProds) {

          try {

               const update = { products: newProds }

               return await this.cartModel.findOneAndUpdate({ "_id": cid }, update).lean()



          }

          catch (err) {

               throw new Error(err)
          }

     }

     async updateProductQuantity(cid, pid, quantity) {

          quantity = parseInt(quantity)

          try {

               if (isNaN(quantity)) {
                    throw new Error("The updateProductQuantity must receive a valid quantity")
               }

               const cart = await this.cartModel.findOne({ _id: cid }).lean()

               let currentQuantity = 0
               const newProds = []

               cart.products.forEach(prod => {

                    prod = prod.toString()


                    if (prod === pid && currentQuantity !== quantity) {
                         currentQuantity++
                         newProds.push(prod)
                    }
                    else if (prod !== pid) {
                         newProds.push(prod)
                    }

               })

               while (currentQuantity < quantity) {
                    newProds.push(pid)
                    currentQuantity++
               }

               return await this.updateProducts(cid, newProds)
          }
          catch (err) {
               throw new Error(err)
          }

     }

     async updateCart(id, newObj) {

          try {

               if (id === undefined || newObj === undefined) {
                    throw new Error("The cartManager.updatecart() function must receive two arguments")
               }


               const cart = await this.cartModel.findOneAndUpdate({ _id: id }, newObj, { new: true }).lean()

               if (cart === null) {
                    throw new Error("Couldn´t find any cart with the following id: " + id)
               }

               return cart



          }
          catch (err) {
               console.error(err)
               throw new Error(err)
          }

     }


     async deleteCartProducts(cid) {

          try {


               return await this.cartModel.findOneAndUpdate({ _id: cid }, { products: [] })

          }
          catch (err) {
               console.error(err)
               throw new Error(err)
          }

     }

     async deleteProductFromCart(cid, pid) {

          try {
              const cart = await this.cartModel.findOne({_id:cid}).lean()
              const newProds = cart.products.filter(x => x.toString() !== pid)

              return await this.updateProducts(cid,newProds)
          }
          catch(err) {
               console.error(err)
               throw new Error(err)
          }

   }



}

module.exports = { CartsManager }