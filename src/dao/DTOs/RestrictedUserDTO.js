class RestrictedUserDTO{
    constructor(user) {
        this.first_name = String(user.first_name)
        this.last_name = user.last_name === undefined ? "" : String(user.last_name)
        this.age = isNaN(parseInt(user.age)) ? 18 : parseInt(user.age)
        this.cart = user.cart
        this.email = user.email
        this.role = user.email === "adminCoder@coder.com" && user.password === "adminCod3r123" ? "admin" : "user"
    }
}

module.exports = {RestrictedUserDTO}