const express = require('express')
let cars = require('../Models/cars')
const router = express.Router();
const bodyParser= require('body-parser');
const { check, validationResult } = require('express-validator');
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended:false}))
const auth = require('../middleware/auth')

router.get('/',async(req,res)=>{
    try {        
        const allCars = await cars.find();
        
        res.send(allCars)
    } catch (err) {
        return res.status(500).send('Server Error' +"    "+err);
    }
});


router.get(':/id',async(req,res)=>{
    try{
        const car = await cars.findById(req.params.id);
        if(!car){
            return res.status(400).send("Not Found!!!");
        }
        res.send(car);
    }catch(err){
        return res.status(500).send('Server Error');
    }
})
router.post('/',auth,[check('make').isLength({min:2})],async(req,res)=>{
    console.log("Try block")    
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        if(req.body!=null){
            const newCar = new cars({
                user:req.user.id,            
                make:req.body.make,
                model:req.body.model,
                year:req.body.year
            });           
            const result = await newCar.save();
            res.send(result);
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
        const car = await cars.findById(req.body.id);
        if(car!=null){
            car.user=req.user.id,
            car.id=req.body.id;
            car.make=req.body.make;
            car.model=req.body.model;
            car.year=req.body.year;
            await car.save();
            res.send(car)
        }
        else{
            res.status(404).send('Car not found!!!');
        }
    } catch (err) {
        
    }
})
router.delete('/',auth,async(req,res)=>{
    try {
        const car = await cars.findById(req.body.id);
        if(!car){
            res.send('Car not found!!!')
        }
       
        const result = await cars.findByIdAndDelete(req.body.id)
        res.send(result)
   
    } catch (err) {
        res.status(404).send('Car not found!!!');        
    }
})
module.exports=router