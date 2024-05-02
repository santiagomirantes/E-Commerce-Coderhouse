class TicketsManager{
    constructor() {
        this.ticketModel = require("./models/ticket.model")
        this.userModel = require("./models/user.model")
    }

    async createTicket(obj) {
        if(typeof obj.amount !== "number" || typeof obj.purchaser !== "string") {
            throw new Error(`Invalid arguments passed to TicketsManager.addTicket`)
        }

        const user = await this.userModel.findOne({_id:obj.purchaser})

        if(user === null) {
            throw new Error("Unexistent purchaser user passed to TicketsManager.addTicket")
        }
        
        let date = Date.now()
        obj.purchase_datetime = date.toString()

        await this.ticketModel.create(obj)

        date = new Date(date)

        return `
        ----PURCHASE TICKET----
        Purchaser Username: ${user.first_name + " " + user.last_name}
        Purchaser Email: ${user.email}
        Payment amount: ${obj.amount}
        Purchase datetime: ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}
        -----------------------
        `

    }
}

module.exports = {TicketsManager}