class cartsManager {

    constructor() {
        this.cartModel = require("./models/cart.model")
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

    async addCart(obj) {

       let isEmpty = this.checkIfEmpty(obj)

       if(isEmpty) {
         console.error("There are arguments missing to create a new cart.")
         throw new Error("There are arguments missing to create a new cart.")
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

    async getcart() {

         try{

              const cart = await this.cartModel.find({}).lean()

              return cart
         }
         catch(err) {
              console.error(err)
              throw new Error(err)
         }

    }

   async getcartById(id) {

    try{

         const cart = await this.cartModel.findOne({_id:id})

         return cart
    }
    catch(err) {
         console.error(err)
         throw new Error(err)
    }

   }

   async updatecart(id,newObj) {

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


   async deletecart(id) {

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

module.exports = { cartsManager }