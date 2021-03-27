const mongoose = require('mongoose')

const CategorySchema=new mongoose.Schema({
    
    name:{
        type:String,
        required:true,
    },
    description:{
        type:String,
    },
    type:{
        type:String,
    }
})

module.exports = mongoose.model('category',CategorySchema)

/**
 name
 description
 type
 */