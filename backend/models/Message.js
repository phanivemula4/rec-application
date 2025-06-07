const { text } = require('express')
const mongoose = require('mongoose')
const { applyTimestamps } = require('./Users')

const MessageSchema = new mongoose.Schema({
    sender:{
        type:String,
        required:true,
    },
    receiver:{
        type:String,
        required:true,
    },
    context:{
        type:String,
        default:null,
    },
    image:{
        type:String,
        default:null,
    },
    timestamp:{
        type:Date,
        default:Date.now,
    },
    isRead: {
    type: Boolean,
    default: false,
  }

})

module.exports = mongoose.model('message',MessageSchema);