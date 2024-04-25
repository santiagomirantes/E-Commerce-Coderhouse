const { MessagesRepository, UsersRepository } = require("../dao/factory")
const express = require("express")
const router = express.Router()
const { checkAuth } = require("../config/passport");

router.post("/", checkAuth, async (req, res) => {
    const obj = req.body
    try {
        
        obj.from = req.user.email

        await MessagesRepository.addMessage(obj)
        res.send("success")
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ error: err.message })
    }
})

module.exports = router