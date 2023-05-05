const express = require('express');
const route = express.Router();
const admincontroller = require('./../controller/admincontroller.js');
const adminauth = require('./../middleware/adminauth.js');
const { islogin } = require('../middleware/auth.js');

route.get('/',adminauth.islogout, admincontroller.loadlogin);
route.post('/adminlogin',adminauth.islogout,admincontroller.verifiylogin);
route.get('/dashboard',adminauth.islogin,admincontroller.admindashboard);
route.get('/logout',adminauth.islogin,admincontroller.logout);
route.all('*',(req,res)=>{ res.redirect('/admin');})
module.exports ={
    route
}