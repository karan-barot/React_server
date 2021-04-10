const express = require('express')
let orders = require('../Models/order')
const router = express.Router();
const bodyParser= require('body-parser');
const { check, validationResult } = require('express-validator');
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended:false}))
const auth = require('../middleware/auth');
const order = require('../Models/order');

router.get('/',async(req,res)=>{
    try {        
        const allorders = await orders.find();
        console.log(allorders)
        res.send(allorders)
    } catch (err) {
        return res.status(500).send('Server Error');
    }
});


router.get(':/id',async(req,res)=>{
    try{
        const order = await orders.findById(req.params.id);
        if(!order){
            return res.status(400).send("Not Found!!!");
        }
        res.send(order);
    }catch(err){
        return res.status(500).send('Server Error');
    }
})
router.post('/',auth,
[
    check('amount','Amount is reuired').not().isEmpty(),
],async(req,res)=>{
    console.log("Try block") 
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }   
    console.log(errors)
    console.log(req.body)
    try {       
        var d = new Date() 
       
        if(req.body!=null){
            const newOrder = new orders({
                user:req.user.id,
                number:d.toISOString().replace(/-/g,'').replace(/:/g,'').replace(/T/,'').slice(0,14)+req.user.id,
                amount:req.body.amount

            });           
            const result = await newOrder.save();
            res.send(newOrder);
        }
        else{
            res.status(500).send('Server Error');      
        }
        
    } catch (err) {
        res.status(500).send('Server Error');        
    }
})

router.delete('/',auth,async(req,res)=>{
    try {
        const order = await orders.findById(req.body.id);
        if(!order){
            res.send('order not found!!!')
        }
       
        const result = await orders.findByIdAndDelete(req.body.id)
        res.send(result)
   
    } catch (err) {
        res.status(404).send('Order not found!!!');        
    }
})
module.exports=router