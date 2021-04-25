const express = require('express')
let brands = require('../Models/brand')
const router = express.Router();
const bodyParser= require('body-parser');
const { check, validationResult } = require('express-validator');
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended:false}))
const auth = require('../middleware/auth')


//Get all brands
router.get('/',async(req,res)=>{
    try {        
        const allbrands = await brands.find();
        
        res.send(allbrands)
    } catch (err) {
        return res.status(500).send('Server Error'+"  " +err    );
    }
});

//Get brand by id
router.get(':/id',async(req,res)=>{
    try{
        const brand = await brands.findById(req.params.id);
        if(!brand){
            return res.status(400).send("Not Found!!!");
        }
        res.send(brand);
    }catch(err){
        return res.status(500).send('Server Error');
    }
})

//Create new brand
router.post('/',auth,
[
    check('name','Brand name is reuired').not().isEmpty(),
    check('name','Brand name should be atleast 2 character long').isLength({min:2}),
    check('description','Brand description is reuired').not().isEmpty(),
    check('category','Brand category is reuired').not().isEmpty(),
    

],async(req,res)=>{

    console.log("Try block") 

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }   
    try {        
        if(req.body!=null){
            const newBrand = new brands({
                name:req.body.name,
                description:req.body.description,
                category:req.body.category,
            });           
            const result = await newBrand.save();
            res.send(newBrand);
        }
        else{
            res.status(500).send('Server Error');      
        }
        
    } catch (err) {
        res.status(500).send('Server Error');        
    }
})


//Edit brand
router.put('/',auth,async(req,res)=>{
    try {
        const brand = await brands.findById(req.body.id);
        if(brand!=null){
            brand.name=req.body.name,
            brand.description=req.body.description,
            brand.category=req.body.category
            await brand.save();
            res.send(brand)
        }
        else{
            res.status(404).send('Brand not found!!!');
        }
    } catch (err) {
        
    }
})

//Delete brand
router.delete('/',auth,async(req,res)=>{
    try {
        const brand = await brands.findById(req.body.id);
        if(!brand){
            res.send('Brand not found!!!')
        }
       
        const result = await brands.findByIdAndDelete(req.body.id)
        res.send(result)
   
    } catch (err) {
        res.status(404).send('Car not found!!!');        
    }
})

module.exports=router