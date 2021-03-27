const mongoose = require('mongoose')

const OrderdetailsSchema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
    },
    item:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'item',
    },
    amount:{
        type:String
    },
    quantity:{
        type:String
    },
})

module.exports = mongoose.model('orderdetails',OrderdetailsSchema)

/**
 user
 item
 order
 
 */