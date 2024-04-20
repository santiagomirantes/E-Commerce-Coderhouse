class UsersManager {

    constructor() {
        this.users = []
        this.dict = [
            "0", "1", "2", "3", "4", "5", "6", "7", "8", "9",
            "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m",
            "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z",
            "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M",
            "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z",
            "!", "#", "$", "%", "&", "(", ")", "*", "+", "-", ".", "/", ":", ";", "<", "=", ">", "?", "@",
            "[", "]", "^", "_", "{", "|", "}", "~"
        ],
        this.bcrypt = require("bcrypt"),
        this.jwt = require("jsonwebtoken")
    }


    setupSession(res,email,password) {

         const token = this.jwt.sign(
            {email,password},
            process.env.SESSION_SECRET,
            {expiresIn:"24h"}
         )


         return token

    }

    createHash(password) {

        return this.bcrypt.hashSync(password,this.bcrypt.genSaltSync(10))

    }

    compareHash(password,hash) {

       return this.bcrypt.compareSync(password,hash)

    }

    async createUser(obj) {

        try {

            obj.password = this.createHash(obj.password)

            this.users.push(obj)
        }
        catch (err) {
            console.log(err)
            throw new Error(err)
        }

    }

    async login(obj) {

        try {

            const user = this.users.find(x => x.email === obj.email)

            if (user === undefined) {
                throw new Error("invalid email.")
            }
            else if (!this.compareHash(obj.password,user.password)) {
                throw new Error("invalid password.")
            }

            return user


        }
        catch (err) {
            throw new Error(err.message)
        }

    }

}

module.exports = { UsersManager }