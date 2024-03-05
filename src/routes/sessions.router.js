const express = require("express")
const router = express.Router()
const UsersManager = require("../dao/db/UsersManager").UsersManager

const um = new UsersManager()

router.get("/check", async (req,res) => {

    res.send({
        isLogged:req.session.sessionID !== undefined
    })
})

router.post("/register", async (req,res) => {
    const obj = req.body


    try{
       await um.createUser(obj)
       req.session.sessionID = um.createSessionID(obj.email,obj.password)
       res.send({status:"success"})
    }
    catch(err) {
        res.status(500).json({error:err.message})
    }
})

router.post("/login", async (req,res) => {

     const obj = req.body

     try{

         await um.login(obj)
         req.session.sessionID = um.createSessionID(obj.email,obj.password)
         res.send({status:"success"})
         

     }
     catch(err) {
        res.status(401).json({error:err.message})
     }

})

router.get("/logout", async (req,res) => {

     try{
        await new Promise((resolve, reject) => {
            req.session.destroy(err => {
              if (err) {
                reject(err)
              } else {
                resolve()
              }
            })
          })
     }
     catch(err) {
        console.log(err)
        res.status(500).json({error:err.message})
     }

})

module.exports = router