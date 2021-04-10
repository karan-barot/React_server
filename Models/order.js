const mongoose = require('mongoose')

const OrderSchema=new mongoose.Schema({
    
    number:{
        type:String,
        required:true,
    },
    orderdate:{
        type:Date,
        default:Date.now
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    amount:{
        type:String,        
    }
})

module.exports = mongoose.model('order',OrderSchema)