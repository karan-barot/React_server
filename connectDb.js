const mongoose = require('mongoose');
const config= require('config');
const uri = process.env.MONGODB_URI
const connectDB= async()=>{
    try {
        await mongoose.connect(uri, {useNewUrlParser: true ,useUnifiedTopology: true })
        console.log('connected to database')
    } catch (err) {
        console.log('unable to connect')
    }
}


module.exports=connectDB