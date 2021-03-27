const express = require('express')
let items = require('../Models/items')
const router = express.Router();
const bodyParser= require('body-parser');
const { check, validationResult } = require('express-validator');
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended:false}))
const auth = require('../middleware/auth')

router.get('/',async(req,res)=>{
    try {        
        const allitems = await items.find();
        
        res.send(allitems)
    } catch (err) {
        return res.status(500).send('Server Error');
    }
});


router.get(':/id',async(req,res)=>{
    try{
        const subcategory = await items.findById(req.params.id);
        if(!subcategory){
            return res.status(400).send("Not Found!!!");
        }
        res.send(subcategory);
    }catch(err){
        return res.status(500).send('Server Error');
    }
})
router.post('/',auth,
[
    check('name','Name is reuired').not().isEmpty(),
    check('name','Name should be atleast 2 character long').isLength({min:2}),
    check('description','description is reuired').not().isEmpty(),
    check('category','category is reuired').not().isEmpty(),
    

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
            const newItem = new items({
                name:req.body.name,
                number:req.body.number,
                description:req.body.description,
                brand:req.body.brand,
                category:req.body.category,
                subcategory:req.body.subcategory
            });           
            const result = await newItem.save();
            res.send(newItem);
        }
        else{
            res.status(500).send('Server Error');      
        }
        
    } catch (err) {
        res.status(500).send('Server Error');        
    }
})

router.put('/',auth,async(req,res)=>{
    try {
        const item = await items.findById(req.body.id);
        if(item!=null){
            item.name=req.body.name,
            item.number=req.body.number,
            item.description=req.body.description,
            item.brand=req.body.brand,
            item.category=req.body.category,
            item.subcategory=req.body.subcategory
            await item.save();
            res.send(item)
        }
        else{
            res.status(404).send('subcategory not found!!!');
        }
    } catch (err) {
        
    }
})
router.delete('/',auth,async(req,res)=>{
    try {
        const item = await items.findById(req.body.id);
        if(!item){
            res.send('subcategory not found!!!')
        }
       
        const result = await items.findByIdAndDelete(req.body.id)
        res.send(result)
   
    } catch (err) {
        res.status(404).send('Car not found!!!');        
    }
})
module.exports=router