const mongoose = require('mongoose');
const config= require('config');
const dbcon=config.get('mongoDBConnection')

const connectDB= async()=>{
    try {
        await mongoose.connect(dbcon, {useNewUrlParser: true ,useUnifiedTopology: true })
        console.log('connected to database')
    } catch (err) {
        console.log('unable to connect')
    }
}


module.exports=connectDB