const mongoose = require('mongoose')

const Schema  = mongoose.Schema
const eventSchema = new Schema({
    name : String,
    description : String,
    idUser : { type: String },
    date: String
})

module.exports = mongoose.model('event',eventSchema, 'events')