const express = require('express')
let carts = require('../Models/cart')
const router = express.Router();
const bodyParser= require('body-parser');
const { check, validationResult } = require('express-validator');
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended:false}))
const auth = require('../middleware/auth')

//Get carts
router.get('/',async(req,res)=>{
    try {        
        const allcarts = await carts.find();
        
        res.send(allcarts)
    } catch (err) {
        return res.status(500).send('Server Error');
    }
});

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
                user:req.body.id,
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
router.delete('/',auth,async(req,res)=>{
    try {
        const cart = await carts.findById(req.body.id);
        if(!cart){
            res.send('cart not found!!!')
        }
       
        const result = await carts.findByIdAndDelete(req.body.id)
        res.send(result)
   
    } catch (err) {
        res.status(404).send('Car not found!!!');        
    }
})


module.exports=router