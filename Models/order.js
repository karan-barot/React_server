const mongoose = require('mongoose')

const OrderSchema=new mongoose.Schema({
    
    orderdetail:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'orderdetail',
    },
    number:{
        type:String,
    },
    placedDate:{
        type:Date,
        default:Date.now
    }
})

module.exports = mongoose.model('order',OrderSchema)