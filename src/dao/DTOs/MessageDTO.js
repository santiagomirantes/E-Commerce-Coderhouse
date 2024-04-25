class MessageDTO{
    constructor(message) {
        this.from = String(message.from)
        this.content = String(message.content)
        this.timestamp = String(message.timestamp)
    }
}

module.exports = {MessageDTO}