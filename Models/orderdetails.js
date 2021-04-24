const mongoose = require('mongoose')

const OrderdetailsSchema=new mongoose.Schema({
    order:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'order',
    },
    item:{
        type:mongoose.Schema.ObjectId,
        ref:'items',
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