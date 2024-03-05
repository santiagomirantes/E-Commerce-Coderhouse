class UsersManager {

    constructor() {
        this.userModel = require("./models/user.model")
        this.dict = [
            "0", "1", "2", "3", "4", "5", "6", "7", "8", "9",
            "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m",
            "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z",
            "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M",
            "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z",
            "!", "#", "$", "%", "&", "(", ")", "*", "+", "-", ".", "/", ":", ";", "<", "=", ">", "?", "@",
            "[", "]", "^", "_", "{", "|", "}", "~"
        ]
    }

    createSessionID(email, password) {

        let all = email.replace(" ", ",") + " " + password.replace(" ", ",")
        let id = []

        all.split("").forEach(letter => {


            if (this.dict.includes(letter)) {
                let pos = this.dict.indexOf(letter)
                pos += all.length

                while (pos > this.dict.length - 1) {
                    pos -= this.dict.length
                }

                id.push(this.dict[pos])

            }
            else {
                id.push(letter)
            }
        })

        return id.reverse().join("")

    }

    decryptSessionID(sessionID) {



        sessionID = sessionID.split("").reverse("")
        const string = []

        sessionID.forEach(letter => {
            if (this.dict.includes(letter)) {
                let pos = this.dict.indexOf(letter)
                pos -= sessionID.length

                while (pos < 0) {
                    pos += this.dict.length
                }

                string.push(this.dict[pos])
            }
            else {
                string.push(letter)
            }
        })


        const arr = string.join("").split(" ")

        return [arr[0].replace(",", " "), arr[1].replace(",", " ")]

    }

    async createUser(obj) {

        try {
            return await this.userModel.create(obj)
        }
        catch (err) {
            console.log(err)
            throw new Error(err)
        }

    }

    async login(obj) {

        try {

            const user = await this.userModel.findOne({ email: obj.email }).lean()

            if (user === null) {
                throw new Error("invalid email.")
            }
            else if (user.password !== obj.password) {
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