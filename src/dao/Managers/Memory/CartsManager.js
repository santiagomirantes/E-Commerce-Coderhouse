class CartsManager {

     constructor() {
          this.carts = []
          this.lastId = -1
     }

     async createCart(obj) {


          if (!Array.isArray(obj.products)) {
               obj.products = []
          }

          try {

               this.lastId++
               obj.id = this.lastId

               this.carts.push(obj)


          }
          catch (err) {
               throw new Error(err)
          }




     }

     async getCarts() {

          try {

               const carts = this.carts

               return carts
          }
          catch (err) {
               throw new Error(err)
          }

     }

     async getCartById(id) {

          try {

               const cart = await this.carts.find(x => x.id === id)

               return cart
          }
          catch (err) {
               throw new Error(err)
          }

     }

     async addProduct(cid, pid) {

          try {
               const cart = this.carts.find(x => x.id === cid)

               if(cart === undefined) {
                    throw new Error("Couldn´t find any cart with the id: " + cid)
               }

               cart.products.push(pid)

               return cart

          }
          catch (err) {
               throw new Error(err)
          }

     }

     async updateProducts(cid, newProds) {

          try {

               if (!Array.isArray(newProds)) {
                    throw new Error("The updated products of a cart must be an array")
               }

               const cart = this.carts.find(x => x.id == cid)

               if(cart === undefined) {
                    throw new Error("Couldn´t find any cart with the id: " + cid)
               }

               cart.products = newProds

               return cart



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

               const cart = this.carts.find(x => x.id === cid)

               if(cart === undefined) {
                    throw new Error("Couldn´t find any cart with the id: " + cid)
               }

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

               cart.products = newProds

               return cart
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


               const index = this.carts.findIndex(x => x.id === id)

               if (index === -1) {
                    throw new Error("Couldn´t find any cart with the following id: " + id)
               }

               this.carts[index] = newObj



               return newObj



          }
          catch (err) {
               throw new Error(err)
          } 

     }


     async deleteCartProducts(cid) {

          try {

               const cart = this.carts.find(x => x.id === cid)

               if(cart === undefined) {
                    throw new Error("Couldn´t find any cart with the id: " + cid)
               }

               cart.products = []

               return cart

          }
          catch (err) {
               throw new Error(err)
          }

     }

     async deleteProductFromCart(cid, pid) {

          try {
               const cart = this.carts.find(x => x.id === cid)

               if (cart === undefined) {
                    throw new Error("Couldn´t find a cart with the id: " + cid)
               }

               cart.products = cart.products.filter(x => x.toString() !== pid)

               return cart
          }
          catch (err) {
               throw new Error(err)
          }

     }



}

module.exports = { CartsManager }