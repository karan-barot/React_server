const express = require('express')
let orderdetails = require('../Models/orderdetails')
const router = express.Router();
const bodyParser= require('body-parser');
const { check, validationResult } = require('express-validator');
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended:false}))
const auth = require('../middleware/auth');

router.get('/',async(req,res)=>{
    try {        
        const allorderdetails = await orderdetails.find();
        console.log(allorderdetails)
        res.send(allorderdetails)
    } catch (err) {
        return res.status(500).send('Server Error');
    }
});


router.get(':/id',async(req,res)=>{
    try{
        const orderdetail = await orderdetails.findById(req.params.id);
        if(!orderdetail){
            return res.status(400).send("Not Found!!!");
        }
        res.send(orderdetail);
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
            const newOrderDetail = new orderdetails({
                order:req.body.order,
                item:req.body.item,
                amount:req.body.amount

            });           
            const result = await newOrderDetail.save();
            res.send(newOrderDetail);
        }
        else{
            res.status(500).send('Server Error');      
        }
        
    } catch (err) {
        console.log(err)
        res.status(500).send('Server Error');        
    }
})

router.delete('/',auth,async(req,res)=>{
    try {
        const order = await orderdetails.findById(req.body.id);
        if(!order){
            res.send('order not found!!!')
        }
       
        const result = await orderdetails.findByIdAndDelete(req.body.id)
        res.send(result)
   
    } catch (err) {
        res.status(404).send('Order not found!!!');        
    }
})
module.exports=router