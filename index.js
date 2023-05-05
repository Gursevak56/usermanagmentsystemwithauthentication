const express = require('express');
const mongoose = require('mongoose');
const userroute = require('./routes/userroute');
const adminroute =require('./routes/adminroute');
const session = require('express-session');
const app = express();
app.use(express.static('public'));
app.use(session({
    secret:'Gursevaksingh',
    saveUninitialized:false,
    resave:false
}))
const bodyparser = require('body-parser');
app.use(bodyparser.urlencoded({extended:true,limit:'50mb'}));
app.use(express.json());
const ejs = require('ejs');
//Database connectivity
mongoose.connect('mongodb://127.0.0.1:27017/user-managment-system',{useNewUrlParser:true}).then(result =>{
    if(result){
        console.log('database connected successfully');
    }
});
//user routes
app.use('/',userroute);
//admin routes
app.use('/admin',adminroute.route);
app.set('view engine','ejs');
app.listen(3000,()=>{
    console.log('server starts on port 3000');
})