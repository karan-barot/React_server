const express = require('express')
let subcategories = require('../Models/subcategory')
const router = express.Router();
const bodyParser= require('body-parser');
const { check, validationResult } = require('express-validator');
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended:false}))
const auth = require('../middleware/auth')

router.get('/',async(req,res)=>{
    try {        
        const allsubcategories = await subcategories.find();
        
        res.send(allsubcategories)
    } catch (err) {
        return res.status(500).send('Server Error');
    }
});


router.get(':/id',async(req,res)=>{
    try{
        const subcategory = await subcategories.findById(req.params.id);
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
            const newSubcat = new subcategories({
                name:req.body.name,
                description:req.body.description,
                category:req.body.category
            });           
            const result = await newSubcat.save();
            res.send(newSubcat);
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
        const subcategory = await subcategories.findById(req.body.id);
        if(subcategory!=null){
            subcategory.name=req.body.name,
            subcategory.description=req.body.description,
            subcategory.category=req.body.category
            await subcategory.save();
            res.send(subcategory)
        }
        else{
            res.status(404).send('subcategory not found!!!');
        }
    } catch (err) {
        
    }
})
router.delete('/',auth,async(req,res)=>{
    try {
        const subcategory = await subcategories.findById(req.body.id);
        if(!subcategory){
            res.send('subcategory not found!!!')
        }
       
        const result = await subcategories.findByIdAndDelete(req.body.id)
        res.send(result)
   
    } catch (err) {
        res.status(404).send('Car not found!!!');        
    }
})
module.exports=router