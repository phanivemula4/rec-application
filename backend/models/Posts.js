const mongoose = require('mongoose')

const Postschema = new mongoose.Schema({
    address:{
        type:String,
        required:true,
    },
    access:{
        type:String,
        required:true,
    },
    sender:{
        type:String,
        required:true,
    },
})

module.exports = mongoose.model('posts',Postschema)