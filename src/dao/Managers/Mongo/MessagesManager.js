class MessagesManager{
    constructor() {
        this.messageModel = require("./models/message.model")
        this.userModel = require("./models/user.model")
    }

    async addMessage(obj) {
           if(typeof obj.from !== "string" || typeof obj.content !== "string") {
              throw new Error("Invalid arguments passed to MessagesManager.addMessage()")
           }

           const user = await this.userModel.findOne({email:obj.from})

           if(user === null) {
             throw new Error("Invalid user passed to MessagesMANAGER.addMessage(): ",user)
           }

           obj.timestamp = Date.now().toString()
           obj.from = user._id

           await this.messageModel.create(obj)

           return obj
    } 

    async getMessages() {
         return await this.messageModel.find({}).lean()
    }

    
}

module.exports = {MessagesManager}