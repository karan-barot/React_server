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



//Login API
router.post('/',
[
    //check if name is not empty
    check('email','Email is required!!!').not().isEmpty(),
    //check password length
    check('password','Password is required!!!').exists()

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
        }
        console.log(u)
        let isMatch = await bcrypt.compareSync(password,u.password)
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
        console.log(err)
        res.status(500).send('Server Error');        
    }
})



module.exports=router