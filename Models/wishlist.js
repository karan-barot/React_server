const mongoose = require('mongoose')

const WishlistSchema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
    },
    item:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'item',
    },
})

module.exports = mongoose.model('wishlist',WishlistSchema)