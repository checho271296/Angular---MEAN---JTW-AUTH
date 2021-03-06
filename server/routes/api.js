const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const bcrypt = require("bcrypt")
const Event = require('../models/event')
const { check, validationResult } = require('express-validator');
const db = 'mongodb+srv://checho2712:serf2712@eventsdb-hw9ry.mongodb.net/eventsdb?retryWrites=true&w=majority'

mongoose.connect(db,err =>{
    if(err){
        console.log('Error!'+err)
    }else{
        console.log('Connected to mongodb')
    }
})

// USER AND LOGIN

function verifyToken(req,res,next){
    if(!req.headers.authorization){
       return res.status(401).send('Unauthorized request')
    }
    let token = req.headers.authorization.split(' ')[1]
    if (token === 'null'){
        return res.status(401).send('Unauthorized request')
    }
    let payload = jwt.verify(token,'secretKey')
    if(!payload){
        return res.status(401).send('Unauthorized request')
    }
    req.userId = payload.subject
    next()
}

router.get('/',(req,res) =>{
    res.send('From API route')
})

router.post('/register', [
    check('password').isLength({ min: 8 }),
    check('email').isEmail()
  ],async (req, res) =>{
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.send("Email or password do not meet the requirements, or there are black spaces. Please check!")
    }else{
        User.findOne({email: req.body.email},(error,user) =>{
            if(error){
                console.log(error)
            }else{
                if(user){
                    res.status(500).send('User already exist!')
                }else{
                    req.body.password = bcrypt.hashSync(req.body.password, 10);
                    let  user = new User(req.body);
                    user.save((error,registeredUser)=>{
                        if(error){
                            console.log(error)
                        }else{
                            let payload = {subject: registeredUser._id}
                            let token = jwt.sign(payload,'secretKey')
                            res.status(200).send({token,user})
                        }
                    })
                }
            }
        })    
    }
})

router.post('/login',(req,res) => {
    let userData = req.body
    User.findOne({email: userData.email}, (error,user) =>{
        if(error){
            console.log(error)
        }else{
            if(!user){
                res.status(401).send('Incorrect email or password!!')
            }else{
                if(!bcrypt.compareSync(userData.password, user.password)){
                    res.status(401).send('Incorrect email or password!!')
                }else{
                    let payload = {subject: user._id}
                    let token = jwt.sign(payload,'secretKey')
                    res.status(200).send({token,user})
                }
            }
        }
    })
})

router.get('/profile/:id', (req,res) =>{
    User.findOne({_id:req.params.id},  (err,user) => {
        if(err){
            console.log(err)
            res.status(401).send("Invalid id")
        }else{
            res.json(user)
        }
    })
})

router.put('/profile/:_id', (req,res) => {
    User.findByIdAndUpdate({_id:req.params._id}, req.body, {new: true},(err,user) =>{
        if(err){
            console.log(err)
            res.status(401).send("Invalid id")
        }else{
            res.send({user})
        }
    })
})

/// EVENTS

router.post('/special/:idUser',verifyToken,(req,res)=> {
    Event.findOne({name:req.body.name,idUser:req.params.idUser},(err,result)=>{
        if(err){
            console.log(err)
        }else{
            if (result){
                res.status(500).send("Event already exist!")
            }else{

                let event = new Event(req.body);
                event.save((err,eventRegistered)=>{
                    if(err){
                        console.log(err)
                    }else{
                        res.status(200).send({eventRegistered})
                    }
                })
            }
        }
    })
})

router.get('/special/:idUser', verifyToken,(req,res)=>{
    Event.find({idUser: req.params.idUser}, (err,event) =>{
        if(err){
            console.log(err)
            res.status(401).send("Invalid id")
        }else{
            res.json(event)
        }
    })
})

router.delete('/special/:id', verifyToken,(req,res)=>{
    Event.findOneAndRemove({_id: req.params.id}, (err,event) =>{
        if(err){
            console.log(err)
            res.status(401).send("Invalid id")
        }else{
            res.json(event)
        }
    })
})

router.put('/special/:id',(req,res)=>{
    Event.findByIdAndUpdate({_id:req.params.id},req.body, {new: true},(err,event)=>{
        if(err){
            res.status(401).send("Invalid event")
        }else{
            res.send(event)
        }
    })
})



module.exports = router
