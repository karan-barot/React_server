const express = require('express')
let user = require('../Models/user')
const router = express.Router();

const bcrypt = require('bcryptjs')
const { check, validationResult } = require('express-validator');

const jwt = require('jsonwebtoken');
const config = require('config')

const bodyParser= require('body-parser');
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended:false}))


router.get('/',async(req,res)=>{
    try {        
        const allCars = await cars.find();
        
        res.send(allCars)
    } catch (err) {
        return res.status(500).send('Server Error');
    }
});
router.get('/:id',async(req,res)=>{
    try {
        const car =await cars.find((c)=>c.id==req.params.id);
        if(!car){
            return res.status(400).send('Not Found!!!')
        }
        else{
            res.send(car)
        }
    } catch (err) {
        return res.status(500).send('Server Error');
    }
});

router.post('/',
[
    //check if name is not empty
    check('email','email is required!!!').not().isEmpty(),
    //check password length
    check('password','Please enter valid Password!!!').exists()

],async(req,res)=>{
        
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    const {email,password}=req.body;
    try {
        let u = await user.findOne({email})
        if(!u){
            return res.status(400).json({errors:[{msg:"User not found"}]});
            console.log(u)
        }
        const isMatch = await bcrypt.compare(password,u.password)
        console.log(isMatch);
        if(!isMatch){
            return res.status(400).json({errors:[{msg:"Incorrect Password"}]});
        }
        const payLoad={
            user:{
                id:u.id,
                name:u.name
            },
        }
        jwt.sign(payLoad,config.get('jwtsecret'),{expiresIn:'1h'},(err,token)=>{
            if(err) throw err;
            res.json({token})
        })
    } catch (err) {
        res.status(500).send('Server Error');        
    }
})

router.put('/',async(req,res)=>{
    try {
        const car = await cars.findById(req.body.id);
        if(car!=null){
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
router.delete('/',async(req,res)=>{
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