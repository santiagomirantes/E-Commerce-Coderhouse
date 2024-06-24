class UsersManager {

    constructor() {
        this.userModel = require("./models/user.model")
        const CartsManager = require("./CartsManager").CartsManager
        this.CartsManager = new CartsManager()
        this.dict = [
            "0", "1", "2", "3", "4", "5", "6", "7", "8", "9",
            "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m",
            "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z",
            "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M",
            "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z",
            "!", "#", "$", "%", "&", "(", ")", "*", "+", "-", ".", "/", ":", ";", "<", "=", ">", "?", "@",
            "[", "]", "^", "_", "{", "|", "}", "~"
        ],
            this.bcrypt = require("bcrypt")
        this.jwt = require("jsonwebtoken")
        this.nodemailer = require("nodemailer")
        this.fs = require("fs").promises
        this.path = require("path")
    }


    setupSession(res, email, password) {

        const token = this.jwt.sign(
            { email, password },
            process.env.SESSION_SECRET,
            { expiresIn: "24h" }
        )


        return token

    }

    createHash(password) {

        return this.bcrypt.hashSync(password, this.bcrypt.genSaltSync(10))

    }

    compareHash(password, hash) {

        return this.bcrypt.compareSync(password, hash)

    }

    async createUser(obj) {


        try {

            const cart = await this.CartsManager.createCart({
                products: []
            })

            obj.cart = cart._id

            obj.password = this.createHash(obj.password)

            return await this.userModel.create(obj)
        }
        catch (err) {
            throw new Error(err)
        }

    }

    async getUsernameById(id) {
        const user = await this.userModel.findOne({ _id: id })

        if (user === null) {
            throw new Error("Couldn´t find any user with the id: " + id)
        }

        return user.first_name + user.last_name
    }

    async login(obj) {


        try {

            const user = await this.userModel.findOne({ email: obj.email }).lean()

            if (user === null) {
                throw new Error("invalid email.")
            }
            else if (!this.compareHash(obj.password, user.password)) {
                throw new Error("invalid password.")
            }

            return user


        }
        catch (err) {
            throw new Error(err.message)
        }

    }

    async changeRole(id) {
        const user = await this.userModel.findOne({ _id: id })
        if (user === null) {
            throw new Error("User not found")
        }
        await this.userModel.findOneAndUpdate({ _id: id }, { role: user.role === "premium" ? "user" : "premium" }, { new: true }).lean()
        return
    }

    async forgotPassword(email) {

        const random = parseInt(Math.random() * 899999 + 100000)
        const route = this.path.join(__dirname, "../../emails/", email)
        await this.fs.writeFile(route, JSON.stringify([0, random]), "utf-8")
        const transporter = this.nodemailer.createTransport({
            service: "Gmail",
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: "santivmirantes@gmail.com",
                pass: process.env.GOOGLE_PASSWORD,
            },
        });



        const mailOptions = {
            from: "santivmirantes@gmail.com",
            to: email,
            subject: "Forgot your password?",
            html: `<h1>Forgot your password?</h1>
            <h2>Please enter the following code in the input shown in the page to restablish your password</h2>
            <h3>${random}</h3>`,
        };


        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error("Error sending email: ", error);
            } else {
                console.log("Email sent: ", info.response);
            }
        });

        return "sent"
    }

    async checkCode(email, code) {
        try {
            const route = this.path.join(__dirname, "../../emails/", email)
            let [tried, realCode] = JSON.parse(await this.fs.readFile(route, "utf-8"))

            tried++


            if (code === realCode) {
                await this.fs.writeFile(route, "checked", "utf-8")
                return "success"
            }
            else {
                if (tried >= 3) {
                    await this.fs.unlink(route)
                    throw new Error("invalid")
                }
                else {
                    await this.fs.writeFile(route,JSON.stringify([tried,realCode]),"utf-8")
                    return "failed"
                }
            }
        }
        catch (err) {
            const route = this.path.join(__dirname, "../../emails/", email)
            await this.fs.unlink(route)
            throw new Error(err)
        }
    }

    async modifyPassword(email,newPassword) {
        const user = await this.userModel.findOne({email})
        if(this.compareHash(newPassword, user.password)) {
            return "same"
        }
        await this.userModel.findOneAndUpdate({email}, {password:this.createHash(newPassword)})
        const route = this.path.join(__dirname,"../../emails/",email)
        await this.fs.unlink(route)
        return "success"
    }

}


module.exports = { UsersManager }