const sendVerifyEmail = require('./../middleware/verifyemail');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');
const session =require('express-session');
const random =require('randomstring');
const registration = async (req,res)=>{
    try {
        res.render('./../views/users/registeration.ejs');
    } catch (error) {
        console.log(error.message);
    }
}
const sercurepassword = async (password)=>{
    try {
        const salt =bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password,salt);
        return hash;
    } catch (error) {
        console.log(error.message);
    }
}
const inserdata=async (req,res)=>{
    try {
        const hashpassword =await sercurepassword(req.body.password);
        const users =new User({
            name:req.body.name,
            email:req.body.email,
            PhoneNumber:req.body.mno,
            image:req.file.filename,
            password:hashpassword,
            plainPassword:req.body.password,
            isverified:0,
            isadmin:0
        })
        const userdata = await users.save();
        if(userdata){
            sendVerifyEmail.verifemail(userdata.name,userdata.email,userdata._id);
            res.render('./../views/users/registeration.ejs',{message:'Your registeration is successfull,please verify your email'});
           
        }
        else{
            console.log('Data insertion error',err.message);
        }
    } catch (error) {
        console.log('error.message');
    }
}
const emailVerified = async (req,res)=>{
    const updated = await User.updateOne({_id:req.query.id},{isverified:1})
    if(updated){
        console.log('email verified successfully');
    }
    else{
        console.log('email has not been verified sorry');
    }
}
const loginLoad = async (req,res)=>{
    res.render('./../views/users/login.ejs');
}
const loginverify =async (req,res)=>{
    try {
        try {
            console.log(req.body)
        const checkemail = await User.findOne({email:req.body.email});
        console.log(checkemail);
        console.log(req.body.password);
        if(checkemail){
            const checkpass = await bcrypt.compare(req.body.password,checkemail.password);
            console.log(checkpass)
            if(!checkpass){
                console.log('email and password are incorrect');
            }
            else{
                const token = await jwt.sign({_id:checkemail._id},'Gursevak');
                const update =await User.findByIdAndUpdate({_id:checkemail._id},{$set:{jwtToken:token}});
                if(!update){
                    console.log('this is error in generation token');
                }
                else{
                    const verified = await User.findOne({_id:checkemail._id});
                    if(verified.isverified=== 0){
                        console.log('email is not verified');
                    }
                    else{
                        req.session.User_Id=checkemail._id;
                        console.log('Login successfully');
                        res.redirect('/home');
                    }
                }
            }
        }
        else{
            console.error('error');
        }
        } catch (error) {
           console.log(error) ;
        }
    } catch (error) {
      console.log(error)  ;
    }
 
}
const userlogout = async (req,res)=>{
try {
req.session.destroy();
res.redirect('/signup');
} catch (error) {
    console.log(error);
}
}
const home =async (req,res)=>
{
    res.render('./../views/users/home.ejs');
}
const forgetpassword = async (req,res)=>{
    res.render('./../views/users/forget.ejs');
}
const resetlink = async (req,res)=>{
    try {
        let checkmail = await User.findOne({email:req.body.email});
        if(!checkmail){
            console.log('invaild email');
        }
        const token = await random.generate();
        const update =await User.findByIdAndUpdate({_id:checkmail._id},{$set:{randomstring:token}});
       const reset=await sendVerifyEmail.sendResetEmail(checkmail.name,checkmail.email,token)
       if(!reset){
        console.log('This is error for your configuration');
       }
       else{
        console.log('verification email send successfully');
       }
;    } catch (error) {
        console.log(error);
    }
}
const resetpassword = async (req,res)=>{
    try {
        const token = await User.findOne({randomstring:req.query.token});
        if(token){
            res.render('./../views/users/resetpassword.ejs',{user_id:token._id});
        }
        
    } catch (error) {
        console.log(error);
    }
}
const updatepassword=async (req,res)=>{
    console.log(req.body);
    try {
        console.log(req.body.user_id);
        const checkuser = await User.findOne({_id:req.body.user_id});
        console.log(checkuser)
        const password = await sercurepassword(req.body.password);
    if(!checkuser){
        console.log('invaild user');
    }
    const update = await User.findByIdAndUpdate({_id:checkuser._id},{$set:{password:password}});
    console.log('password has been changed');
    } catch (error) {
        console.log('error');
    }
}
module.exports = {
    registration,
    inserdata,
    emailVerified,
    loginLoad,
    loginverify,
    userlogout,
    home,
    forgetpassword,
    resetlink,
    resetpassword,
    updatepassword
}