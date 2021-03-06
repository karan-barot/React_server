const mongoose = require('mongoose')

const CartSchema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
    },
    item:{
        type:mongoose.Schema.ObjectId,
        ref:'items',
    },
    quantity:{
        type:String,
    },
    amount:{
        type:String,
    }
})

module.exports = mongoose.model('cart',CartSchema)


/**
 user
 item
 amount
 quantity
 */