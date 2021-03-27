const express = require('express')
let whishes = require('../Models/wishlist')
const router = express.Router();
const bodyParser= require('body-parser');
const { check, validationResult } = require('express-validator');
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended:false}))
const auth = require('../middleware/auth')

router.get('/',async(req,res)=>{
    try {        
        const allwhishes = await whishes.find();
        
        res.send(allwhishes)
    } catch (err) {
        return res.status(500).send('Server Error');
    }
});


router.get(':/id',async(req,res)=>{
    try{
        const wish = await whishes.findById(req.params.id);
        if(!wish){
            return res.status(400).send("Not Found!!!");
        }
        res.send(whish);
    }catch(err){
        return res.status(500).send('Server Error');
    }
})
router.post('/',auth,
[
    check('item','item is reuired').not().isEmpty(),    

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
            const newwhish = new whishes({
                item:req.body.item,
                user:req.body.id,
            });           
            const result = await newwhish.save();
            res.send(newwhish);
        }
        else{
            res.status(500).send('Server Error');      
        }
        
    } catch (err) {
        res.status(500).send('Server Error');        
    }
})

router.put('/',auth,
[
    check('item','item is reuired').not().isEmpty(),    

],async(req,res)=>{
    try {
        const whish = await whishes.findById(req.body.id);
        if(whish!=null){
            whish.item=req.body.item,
            whish.user=req.body.id,
            await whish.save();
            res.send(whish)
        }
        else{
            res.status(404).send('whish not found!!!');
        }
    } catch (err) {
        
    }
})
router.delete('/',auth,async(req,res)=>{
    try {
        const whish = await whishes.findById(req.body.id);
        if(!whish){
            res.send('whish not found!!!')
        }
       
        const result = await whishes.findByIdAndDelete(req.body.id)
        res.send(result)
   
    } catch (err) {
        res.status(404).send('Car not found!!!');        
    }
})
module.exports=router