const mongoose = require('mongoose')

const ItemSchema=new mongoose.Schema({
    
    name:{
        type:String,
        required:true,
    },
    number:{
        type:String,
    },
    description:{
        type:String,
        required:true,
    },
    image:{
        type:String
    },
    size:{
        type:String
    },
    color:{
        type:String
    },
    price:{
        type:String
    },
    brand:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'brand',
    },
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'category',
    },
    subcategory:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'subcategory',
    }
})

module.exports = mongoose.model('item',ItemSchema)

/**
name
number
description
brand
category
subcategory
 */