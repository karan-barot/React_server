const express = require('express')
const app = express()
const cors = require('cors')
app.use(cors())
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

//Environment
var environment = process.env.NODE_ENV || 'development'
const connectDB = require('./Config/connectDB')

//Make folder public
const { static } = require('express')

connectDB()
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
//Use environment's port
app.listen(process.env.PORT||5000,()=>{
    console.log("server started")
})