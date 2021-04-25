const jwt = require('jsonwebtoken')
const config = require('config')

module.exports = function (req,res,next){
    const token = req.header('x-auth-token')
    if(!token){
        return res.status(400).json({msg:"no token authorization!! denied"})
    }

    try{
        const decoded = jwt.verify(token,process.env.JWT_TOKEN)

        req.user=decoded.user
        next();
    }catch(err){
        res.status(400).json({msg:"token is not valid"})
    }
}