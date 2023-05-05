const Admin =require('./../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const loadlogin = async (req,res)=>{
    try {
        res.render('./../views/admin/loginview.ejs');
    } catch (error) {
        console.log(error);
    }
}
const verifiylogin = async (req,res)=>{
    try {
        const admindata = await Admin.findOne({email:req.body.email});
        console.log(admindata)
        if(!admindata){
            console.log('invaild email or password');
        }
        const ispassword = await bcrypt.compare(req.body.password,admindata.password);
        console.log(ispassword);
        if(!ispassword){
            console.log('email or password is incorrect');
        }
        if(admindata.isadmin===0){
            console.log('you are not admin');
        }
        req.session.admin_id=admindata._id;

        res.redirect('/admin/dashboard');
    } catch (error) {
        console.log(error);
    }
}
const admindashboard = async (req,res)=>{
    res.render('./../views/admin/home.ejs');
}
const logout = async (req,res)=>
  { 
    const logout =await req.session.destroy()
    console.log(logout);
    res.redirect('/admin/');
}

module.exports = {
    loadlogin,
    verifiylogin,
    admindashboard,
    logout
}