class TicketDTO {
    constructor(ticket) {
        this.purchase_datetime = String(ticket.purchase_datetime)
        this.amount = Number(ticket.amount)
        this.purchaser = String(ticket.purchaser)
    }
}
module.exports = {TicketDTO}