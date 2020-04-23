const mongoose = require('mongoose')

const Schema  = mongoose.Schema
const userSchema = new Schema({
    id : { type: String },
    name : String,
    lastname1 : String,
    lastname2 : String,
    birthday: String,
    email : String,
    password: String
})

module.exports = mongoose.model('user',userSchema, 'users')