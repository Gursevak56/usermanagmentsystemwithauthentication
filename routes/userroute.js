const express=require('express');
const route = express.Router();
const userController = require('./../controller/userController');
const auth = require('./../middleware/auth');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,path.join(__dirname,'/../public/userImage'));
    },
    filename:function(req,file,cb){
        const name =Date.now()+''+file.originalname;
        cb(null,name);
    }
})
const update = multer({storage:storage});
route.get('/',auth.islogin, userController.home)
route.get('/signUp',auth.islogut, userController.registration);
route.post('/signup',update.single('image') ,userController.inserdata);
route.get('/verify',userController.emailVerified);
route.get('/login', auth.islogut, userController.loginLoad);
route.post('/login',userController.loginverify);
route.get('/logout',auth.islogin, userController.userlogout);
route.get('/home',auth.islogin,userController.home);
route.get('/empty',(req,res)=>{
    console.log('route');
})
route.get('/forget',auth.islogut,userController.forgetpassword);
route.post('/forget',auth.islogut,userController.resetlink);
route.get('/forget-password',auth.islogut,userController.resetpassword);
route.post('/upadatepassword',userController.updatepassword);
module.exports=route; 