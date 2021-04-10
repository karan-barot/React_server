const express = require('express')
let user = require('../Models/user')
const router = express.Router();
const auth = require('../middleware/auth')
const bcrypt = require('bcryptjs')
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const config = require('config')
const bodyParser= require('body-parser');
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended:false}))


router.get('/',async(req,res)=>{
    try {        
        const users = await user.find();
        
        res.send(users)
    } catch (err) {
        return res.status(500).send('Server Error');
    }
});


router.post('/',
[
    //check if name is not empty
    check('name','Name is required!!!').not().isEmpty(),
    //check if email 
    check('email','Please enter a valid Email!!!').isEmail(),
    //check password length
    check('password','Please enter valid Password!!!').isLength({min:3})

],async(req,res)=>{
        
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    try {
        const hashpass = await bcrypt.hash(req.body.password,12);
        const newUser = new user({
            name:req.body.name,
            password:hashpass,
            email:req.body.email
        })
        await newUser.save();
        const payLoad={
            user:{
                id:newUser.id,
                name:newUser.name
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

router.put('/',auth,async(req,res)=>{
    try {
        const u = await user.findById(req.body.id);
        if(u!=null){
            u.email=req.body.email;
            u.name=req.body.name;
            u.password=req.body.password;
            await u.save();
            res.send(u)
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