class TicketsRepository{
    constructor(TicketsManager,TicketDTO) {
        this.TicketsManager = new TicketsManager()
        this.TicketDTO = TicketDTO
    }

    async createTicket(obj) {
        obj = new this.TicketDTO(obj)
        return await this.TicketsManager.createTicket(obj)
    }
}

module.exports = TicketsRepository