class CartsManager {

    constructor() {
        this.cartModel = require("./models/cart.model")
    }

    async createCart(obj) {


       if(!Array.isArray(obj.products)) {
         obj.products = []
       }

       try{


           const cart = new this.cartModel(obj)

           await cart.save()

          
       }
       catch(err) {
          console.error(err)
          throw new Error(err)
       }
       



    }

    async getCart() {

         try{

              const cart = await this.cartModel.find({}).lean()

              return cart
         }
         catch(err) {
              console.error(err)
              throw new Error(err)
         }

    }

   async getCartById(id) {

    try{

         const cart = await this.cartModel.findOne({_id:id})

         return cart
    }
    catch(err) {
         console.error(err)
         throw new Error(err)
    }

   }

   async updateCart(id,newObj) {

     try{

         if (id === undefined || newObj === undefined) {
              throw new Error("The cartManager.updatecart() function must receive two arguments")
          }


          const cart = await this.cartModel.findOneAndUpdate({_id:id},newObj,{new:true}).lean()

          if(cart === null) {
              throw new Error("Couldn´t find any cart with the following id: " + id)
          }

          return cart



     }
     catch(err) {
         console.error(err)
         throw new Error(err)
     }

   }


   async deleteCart(id) {

       try{

         
         const deletedCart = this.cartModel.findOneAndDelete({_id:id})

         if (!deletedCart) {
              throw new Error("Cart not found")
         }

       }
       catch(err) {
         console.error(err)
         throw new Error(err)
       }

   }

   

}

module.exports = { CartsManager }