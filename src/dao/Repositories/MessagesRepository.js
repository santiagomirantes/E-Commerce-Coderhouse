class MessagesRepository{
    constructor(MessagesManager,MessageDTO) {
        this.MessagesManager = new MessagesManager()
        this.MessageDTO = MessageDTO
    }

    async addMessage(obj) {
        obj = new this.MessageDTO(obj)
        return await this.MessagesManager.addMessage(obj)
    }

    async getMessages() {
        return await this.MessagesManager.getMessages()
    }
}

module.exports = MessagesRepository