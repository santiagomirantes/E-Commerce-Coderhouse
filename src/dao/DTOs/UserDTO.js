class UserDTO{
    constructor(user) {
         this.first_name = String(user.first_name)
         this.last_name = user.last_name === undefined ? "" : String(user.last_name)
         this.email = user.email
         this.age = isNaN(parseInt(user.age)) ? 18 : parseInt(user.age)
         this.password = user.password
         this.cart = user.cart
         this.role = user.email === "adminCoder@coder.com" && user.password === "adminCod3r123" ? "admin" : (user.role === "premium" ? "premium" : "user")
         this.documents = Array.isArray(user.documents) ? user.documents : []
    }
}

module.exports = {UserDTO}