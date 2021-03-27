const mongoose = require('mongoose')

const CarSchema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
    },
    make:{
        type:String,
        required:true,
    },
    model:{
        type:String,
    },
    year:{
        type:String,
    }
})

module.exports = mongoose.model('car',CarSchema)