const express = require('express')
require('dotenv').config()
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
app.use(cors())


const uri = process.env.MONGODB_URI || "mongodb+srv://karan:1234@cluster0.fy2i9.mongodb.net/taskapp?retryWrites=true&w=majority"
mongoose.connect(uri,{ useNewUrlParser: true, useCreateIndex: true ,useUnifiedTopology: true })
const connection = mongoose.connection;
connection.once('open',()=>{
    console.log('Database connection established successfully');
})

const carRoutes = require('./api/carsRoutes')
const userRoutes = require('./api/userRoutes')
const authRoutes = require('./api/authRoutes')
const brandRoutes = require('./api/brandRoutes')
const categoryRoutes = require('./api/categoryRoutes')
const subcategoryRoutes = require('./api/subcategoryRoutes')
const itemRoutes = require('./api/itemRoutes')
const cartRoutes = require('./api/cartRoutes')
const wishlistRoutes = require('./api/wishlistRoutes')
const orderRoutes = require('./api/orderRoutes')
const orderDetailsRoutes = require('./api/orderDetailsRoutes')

const PORT = process.env.PORT||5000
const { static } = require('express')

app.use('/uploads',express.static('uploads'))
app.use('/api/car',carRoutes)
app.use('/api/user',userRoutes)
app.use('/api/auth',authRoutes)
app.use('/api/brand',brandRoutes)
app.use('/api/category',categoryRoutes)
app.use('/api/subcategory',subcategoryRoutes)
app.use('/api/item',itemRoutes)
app.use('/api/cart',cartRoutes)
app.use('/api/wishlist',wishlistRoutes)
app.use('/api/order',orderRoutes)
app.use('/api/orderdetails',orderDetailsRoutes)
//Use environment's port
app.listen(PORT,()=>{
    console.log("server started")
})