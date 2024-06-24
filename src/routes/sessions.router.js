const express = require("express")
const router = express.Router()
const fs = require("fs").promises
const path = require("path")
const {UsersRepository} = require("../dao/factory")
const {CustomError} = require("../errors/CustomError")
const {getError} = require("../errors/errorsDict")
const multer  = require('multer')
const uploadAvatars = multer({ dest: '../dao/images/profiles' })
const uploadProducts = multer({ dest: '../dao/images/products' })
const uploadDocuments = multer({ dest: '../dao/images/documents'})

const passport = require("passport")


router.post("/register", async (req,res) => {
    const obj = req.body

    try{

       await UsersRepository.createUser(obj)

       UsersRepository.setupSession(res,obj.email,obj.password)

       res.send({status:"success"})
    }
    catch(err) {
        err = new CustomError(getError(err.message))
        req.logger.error(err)
        res.status(500).json({error:err.message})
    }
})

router.post("/login", async (req,res) => {

    const obj = req.body

     try{

         await UsersRepository.login(obj)

         const token = UsersRepository.setupSession(res,obj.email,obj.password)

         res.cookie("jwt",token).send({status:"success"})
         

     }
     catch(err) {
        res.status(401).json({error:err.message})
     }

})

router.get("/github",passport.authenticate("github",{scope:["user:email"]}), async (req,res) => {
 })

router.get("/githubcallback",passport.authenticate("github",{session:false,failureRedirect:"/login"}), async (req,res) => {
    const token = UsersRepository.setupSession(res,req.user.email,req.user.password)
    res.cookie("jwt",token).redirect("/products")
})

router.get("/logout", async (req,res) => {

     try{
          res.clearCookie("jwt").send({status:"success"})
     }
     catch(err) {
        err = new CustomError(getError(err.message))
        req.logger.error(err)
        res.status(500).json({error:err.message})
     }

})

router.get("/forgotpassword/:email",async (req,res) => {
    const email = decodeURIComponent(req.params.email)
    try{
          await UsersRepository.forgotPassword(email)
          res.send({status:"success"})
    }
    catch(err) {
        err = new CustomError(getError(err.message))
        req.logger.error(err)
        res.status(500).json({error:err.message})
    }
})

router.post("/forgotpassword/:email", async (req,res) => {
    const email = decodeURIComponent(req.params.email)
    const body = req.body
    try{
        const status = await UsersRepository.checkCode(email,body.code)
        res.send({status})
    }
    catch(err) {
        err = new CustomError(getError(err.message))
        req.logger.error(err)
        res.status(500).json({error:err.message})
    }
})

router.put("/modifypassword/:email", async (req,res) => {
    const email = req.params.email
    const newPassword = req.body.password
    try{
       const status = await UsersRepository.modifyPassword(email,newPassword)
       res.send({status})
    }
    catch(err) {
        err = new CustomError(getError(err.message))
        req.logger.error(err)
        res.status(500).json({error:err.message})
    }
})

router.get("/premium/:id", async (req,res) => {
    const id = req.params.id

    try{
       await UsersRepository.changeRole(id)
       res.send({status:"success"})
    }
    catch(err) {
        err = new CustomError(getError(err.message))
        req.logger.error(err)
        res.status(500).json({error:err.message})
    }
})

module.exports = router