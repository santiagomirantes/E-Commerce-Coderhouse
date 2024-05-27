const { MessagesRepository, UsersRepository } = require("../dao/factory")
const express = require("express")
const router = express.Router()
const { checkAuth } = require("../config/passport");
const {CustomError} = require("../errors/CustomError")
const {getError} = require("../errors/errorsDict")

router.post("/", checkAuth, async (req, res) => {
    const obj = req.body
    try {
        
        obj.from = req.user.email

        await MessagesRepository.addMessage(obj)
        res.send({status:"success"})
    }
    catch (err) {
        err = new CustomError(getError(err.message))
        req.logger.error(err)
        res.status(500).json({ error: err.message })
    }
})

module.exports = router