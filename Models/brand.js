const mongoose = require('mongoose')

const BrandSchema=new mongoose.Schema({
    
    name:{
        type:String,
        required:true,
    },
    description:{
        type:String,
    },
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'category',
    }
})

module.exports = mongoose.model('brand',BrandSchema)

/*
item
name
description
category
*/ 