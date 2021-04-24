const express = require('express')
let carts = require('../Models/cart')
const router = express.Router();
const bodyParser= require('body-parser');
const { check, validationResult } = require('express-validator');
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended:false}))
const auth = require('../middleware/auth')
const mongoose = require('mongoose');

const ObjectId = mongoose.Types.ObjectId
//Get carts
router.get('/',async(req,res)=>{
    try {        
        const allcarts = await carts.find();
        
        res.send(allcarts)
    } catch (err) {
        return res.status(500).send('Server Error');
    }
});
//Get use rcart
router.get('/user/:id',async(req,res)=>{
    console.log('user cart')
    console.log(req.params.id)
    const userid =  req.params.id
    try{
        const userCart = await carts.aggregate([
            {
                $match:{
                    user:ObjectId(userid)
                }
            },
            {
                $lookup:
                {
                    from:'items',
                    localField:"item",
                    foreignField:"_id",                    
                    as:"itemdetails",                  
                }
            }
        ])
        userCart.forEach(userCart=>console.log(userCart))
    
        res.send(userCart)
    }catch(err){
        console.log(err)
    }
})
//get cart by id
router.get(':/id',async(req,res)=>{
    try{
        const cart = await carts.findById(req.params.id);
        if(!cart){
            return res.status(400).send("Not Found!!!");
        }
        res.send(cart);
    }catch(err){
        return res.status(500).send('Server Error');
    }
})

//add cart
router.post('/',auth,
[
    check('amount','amount is reuired').not().isEmpty(),
    check('quantity','quantity is reuired').not().isEmpty(),
],async(req,res)=>{
    console.log("Try block") 
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }   
    console.log(errors)
    console.log(req.body)
    try {        
        if(req.body!=null){
            const newCart = new carts({
                item:req.body.item,
                user:req.body.user,
                amount:req.body.amount,
                quantity:req.body.quantity
            });           
            const result = await newCart.save();
            res.send(newCart);
        }
        else{
            res.status(500).send('Server Error');      
        }
        
    } catch (err) {
        console.error(err)

        res.status(500).send('Server Error');        
    }
})


//edit cart
router.put('/',auth,async(req,res)=>{
    try {
        const cart = await carts.findById(req.body.id);
        if(cart!=null){
            cart.item=req.body.item,
            cart.user=req.body.id,
            cart.amount=req.body.amount,
            cart.quantity=req.body.quantity
            await cart.save();
            res.send(cart)
        }
        else{
            res.status(404).send('cart not found!!!');
        }
    } catch (err) {
        
    }
})

//delete cart
router.delete('/:id',async(req,res)=>{
    console.log("delete carts")
    console.log(req.params)
    try {
        const cart = await carts.findById(req.params.id);
        if(!cart){
            res.send('cart not found!!!')
        }
       
        const result = await carts.findByIdAndDelete(req.params.id)
        res.status(200).send(result)
   
    } catch (err) {
        res.status(404).send('Car not found!!!');        
    }
})


module.exports=router