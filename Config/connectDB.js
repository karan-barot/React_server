const mongoose = require('mongoose');
const config= require('config');

const connectDB= async()=>{
    try {
        await mongoose.connect(config.get('MongoDB.connectionString'), {useNewUrlParser: true ,useUnifiedTopology: true })
        mongoose.set('bufferCommands', false);
        console.log('connected to database')
    } catch (err) {
        console.log('unable to connect')
    }
}


module.exports=connectDB