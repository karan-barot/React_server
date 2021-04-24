const express = require('express')
let categories = require('../Models/category')
const router = express.Router();
const bodyParser= require('body-parser');
const { check, validationResult } = require('express-validator');
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended:false}))
const auth = require('../middleware/auth')

router.get('/',async(req,res)=>{
    try {        
        const allcategories = await categories.find();
        
        res.send(allcategories)
    } catch (err) {
        return res.status(500).send('Server Error'+ "      Karan      "+err.json());
    }
});


router.get(':/id',async(req,res)=>{
    try{
        const category = await categories.findById(req.params.id);
        if(!category){
            return res.status(400).send("Not Found!!!");
        }
        res.send(category);
    }catch(err){
        return res.status(500).send('Server Error');
    }
})
router.post('/',auth,
[
    check('name','Name is reuired').not().isEmpty(),
    check('name','Name should be atleast 2 character long').isLength({min:2}),
    check('description','description is reuired').not().isEmpty(),
    check('type','type is reuired').not().isEmpty(),
    

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
            const newCat = new categories({
                name:req.body.name,
                description:req.body.description,
                type:req.body.type
            });           
            const result = await newCat.save();
            res.send(newCat);
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
        const category = await categories.findById(req.body.id);
        if(category!=null){
            category.name=req.body.name,
            category.description=req.body.description,
            category.category=req.body.category
            await category.save();
            res.send(category)
        }
        else{
            res.status(404).send('category not found!!!');
        }
    } catch (err) {
        
    }
})
router.delete('/',auth,async(req,res)=>{
    try {
        const category = await categories.findById(req.body.id);
        if(!category){
            res.send('category not found!!!')
        }
       
        const result = await categories.findByIdAndDelete(req.body.id)
        res.send(result)
   
    } catch (err) {
        res.status(404).send('Car not found!!!');        
    }
})
module.exports=router