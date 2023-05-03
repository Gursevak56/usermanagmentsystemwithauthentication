const sendVerifyEmail = require('./../middleware/verifyemail');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');
const session =require('express-session');
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
            sendVerifyEmail(userdata.name,userdata.email,userdata._id);
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
module.exports = {
    registration,
    inserdata,
    emailVerified,
    loginLoad,
    loginverify,
    userlogout,
    home
}