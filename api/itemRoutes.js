const express = require('express')
let items = require('../Models/items')
const router = express.Router();
const bodyParser= require('body-parser');
const { check, validationResult } = require('express-validator');
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended:true}))


const auth = require('../middleware/auth')



const multer = require('multer');

const fileFilter1 = (req,file,cb)=>{
    if(file.mimetype==='image/jpeg'||file.mimetype==='img/png'){
        cb(null,true)
    }else{
        cb(null,false)
    }
}
const storage1 = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'./uploads/');
    },
    filename:function(req,file,cb){
        cb(null,file.originalname)
    }
});
   
var upload = multer({ 
    storage: storage1 ,
    fileFilter:fileFilter1
})


//get
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
router.post('/',upload.single('image'),auth,
[
    check('name','Name is reuired').not().isEmpty(),
    check('name','Name should be atleast 2 character long').isLength({min:2}),
    check('description','description is reuired').not().isEmpty(),
    check('category','category is reuired').not().isEmpty(),
    

],async(req,res)=>{
    
    console.log("item post")
  
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors)
        return res.status(422).json({ errors: errors.array() });
    }  

    try {       

        console.log(req.body)
        console.log(req.file.path)
        console.log("in try")
        if(req.body!=null){
            const newItem = new items({
                name:req.body.name,
                number:req.body.number,
                description:req.body.description,
                brand:req.body.brand,
                category:req.body.category,
                subcategory:req.body.subcategory,
                price:req.body.price,
                color:req.body.color,
                size:req.body.size,
                image:req.file.path
            });           
            const result = await newItem.save();
            console.log("success")
            res.send(result);
        
        }
 
    } catch (err) {
        console.log(err)
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
            item.color=req.body.color,
            item.size=req.body.size,
            item.color=req.body.color,
            item.price=req.body.price,
            item.category=req.body.category,
            item.subcategory=req.body.subcategory
            item.image=req.file.path
            await item.save();
            res.send(item)
        }
        else{
            res.status(404).send('subcategory not found!!!');
        }
    } catch (err) {
        
    }
})
router.delete('/:id',auth,async(req,res)=>{
    console.log("delete request")
    console.log(req.params)

    const id = req.params.id
    try {
        console.log("delete item")

        const item = await items.findById(id);
        if(!item){
            res.send('Item not found!!!')
        }
       
        const result = await items.findByIdAndDelete(id)
        console.log("success")
        res.send(result)
   
    } catch (err) {
        console.log(err)
        res.status(404).send('item not found!!!');        
    }
})
module.exports=router