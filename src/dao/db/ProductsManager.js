class ProductsManager {

     constructor() {
         this.productModel = require("./models/product.model")
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

        let isEmpty = this.checkIfEmpty(obj)

        if(isEmpty) {
          console.error("There are arguments missing to create a new product.")
          throw new Error("There are arguments missing to create a new product.")
        }

        try{


            const product = new this.productModel(obj)

            await product.save()

           
        }
        catch(err) {
           console.error(err)
           throw new Error(err)
        }
        



     }

     async getProducts() {

          try{

               const products = await this.productModel.find({}).lean()

               return products
          }
          catch(err) {
               console.error(err)
               throw new Error(err)
          }

     }

    async getProductById(id) {

     try{

          const products = await this.productModel.findOne({_id:id})

          return products
     }
     catch(err) {
          console.error(err)
          throw new Error(err)
     }

    }

    async updateProduct(id,newObj) {

      try{

          if (id === undefined || newObj === undefined) {
               throw new Error("The ProductManager.updateProduct() function must receive two arguments")
           }


           const product = await this.productModel.findOneAndUpdate({_id:id},newObj,{new:true}).lean()

           if(product === null) {
               throw new Error("Couldn´t find any product with the following id: " + id)
           }

           return product



      }
      catch(err) {
          console.error(err)
          throw new Error(err)
      }

    }


    async deleteProduct(id) {

        try{

          
          const deletedProduct = this.productModel.findOneAndDelete({_id:id})

          if (!deletedProduct) {
               throw new Error("Product not found")
          }

        }
        catch(err) {
          console.error(err)
          throw new Error(err)
        }

    }

    

}

module.exports = { ProductsManager }