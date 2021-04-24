const express = require('express')
let orderdetails = require('../Models/orderdetails')
const router = express.Router();
const bodyParser= require('body-parser');
const { check, validationResult } = require('express-validator');
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended:false}))
const auth = require('../middleware/auth');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId

//GEt all od
router.get('/',async(req,res)=>{
    try {        
        const allorderdetails = await orderdetails.find();
        console.log(allorderdetails)
        res.send(allorderdetails)
    } catch (err) {
        return res.status(500).send('Server Error');
    }
});

router.get('/order/:id',async(req,res)=>{

    var orderId = req.params.id
    try {        
        const allorderdetails = await orderdetails.aggregate([
            {
                $match:{
                    order:ObjectId(orderId)
                }
            },
            {
                $lookup:{
                    from:'items',
                    localField:"item",
                    foreignField:"_id",                    
                    as:"itemdetails",  
                }
            }
        ]);
        res.send(allorderdetails)
    } catch (err) {
        return res.status(500).send('Server Error');
    }
})
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
router.post('/',auth,async(req,res)=>{
    console.log(req.body)
    try {       
       
        if(req.body!=null){
            const newOrderDetail = new orderdetails({
                order:req.body.order,
                item:req.body.item,
                amount:req.body.amount,
                quantity:req.body.quantity
            });           
            const result = await newOrderDetail.save();
            res.send(newOrderDetail);
        }
        else{
            res.status(500).send('Server Error');      
        }
        
    } catch (err) {
        res.status(500).send('Server Error');        
    }
})
/*
router.delete('/:id',auth,async(req,res)=>{
    try {
        const order = await orderdetails.findById(req.params.id);
        if(!order){
            res.send('order not found!!!')
        }
       
        const result = await orderdetails.findByIdAndDelete(req.params.id)
        res.send(result)
   
    } catch (err) {
        res.status(404).send('Order not found!!!');        
    }
})
*/

router.delete('/',async(req,res)=>{

    console.log('delete all')
    try{
        const o = await orderdetails.remove({})
        console.log(o)
    }catch (err) {
        console.log(err)
    }
})
module.exports=router