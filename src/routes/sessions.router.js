const express = require("express")
const router = express.Router()
const UsersManager = require("../dao/db/UsersManager").UsersManager
const passport = require("passport")

const um = new UsersManager()

router.post("/register", async (req,res) => {
    const obj = req.body


    try{
       await um.createUser(obj)

       um.setupSession(res,obj.email,obj.password)

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

         const token = um.setupSession(res,obj.email,obj.password)

         res.cookie("jwt",token).send({status:"success"})
         

     }
     catch(err) {
        res.status(401).json({error:err.message})
     }

})

router.get("/github",passport.authenticate("github",{scope:["user:email"]}), async (req,res) => {
 })

router.get("/githubcallback",passport.authenticate("github",{session:false,failureRedirect:"/login"}), async (req,res) => {
    res.redirect("/products")
})

router.get("/logout", async (req,res) => {

     try{
          res.clearCookie("jwt").send({status:"success"})
     }
     catch(err) {
        console.log(err)
        res.status(500).json({error:err.message})
     }

})

module.exports = router