const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const bcrypt = require("bcrypt")
const saltRounds = 10;

const db = 'mongodb+srv://checho2712:serf2712@eventsdb-hw9ry.mongodb.net/eventsdb?retryWrites=true&w=majority'

mongoose.connect(db,err =>{
    if(err){
        console.log('Error!'+err)
    }else{
        console.log('Connected to mongodb')
    }
})

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

router.post('/register', async (req, res) =>{
    req.body.password = bcrypt.hashSync(req.body.password, 10);
    let  user = new User(req.body);
    
   
    user.save((error,registeredUser)=>{
    if(error){
        console.log(error)
    }else{
        let payload = {subject: registeredUser._id}
        let token = jwt.sign(payload,'secretKey')
        res.status(200).send({token})
    }
})
    
})

router.post('/login',(req,res) => {
    let userData = req.body
    User.findOne({email: userData.email}, (error,user) =>{
        if(error){
            console.log(error)
        }else{
            if(!user){
                res.status(401).send('Invalid email')
            }else{
                if(!bcrypt.compareSync(userData.password, user.password)){
                    res.status(401).send('Invalid password')
                }else{
                    let payload = {subject: user._id}
                    let token = jwt.sign(payload,'secretKey')
                    res.status(200).send({token})
                }
            }
        }
    })
})

router.get('/events', (req,res)=>{
    let events = [{"_id": "1","name":"Auto expo","description": "BMW Special Sales","date":"2012-04-23T18:25:43.511Z"},{
    "_id": "2","name":"Concert","description": "Linking Park concert","date":"2012-04-23T18:25:43.511Z"}
    ]
    
    res.json(events)
})

router.get('/special', verifyToken, (req,res)=>{
    let specialEvents =  [{"_id": "1","name":"Auto expo","description": "BMW Special Sales","date":"2012-04-23T18:25:43.511Z"},{
        "_id": "2","name":"Concert","description": "Linking Park concert","date":"2012-04-23T18:25:43.511Z"}
        ]
    res.json(specialEvents)
})

module.exports = router
