const express = require('express');
const mongoose = require('mongoose');
const route = require('./routes/userroute');
const session = require('express-session');
const app = express();
app.use(session({
    secret:'Gursevaksingh',
    saveUninitialized:false,
    resave:false
}))
const bodyparser = require('body-parser');
app.use(bodyparser.urlencoded({extended:true}));
const ejs = require('ejs');
//Database connectivity
mongoose.connect('mongodb://127.0.0.1:27017/user-managment-system',{useNewUrlParser:true}).then(result =>{
    if(result){
        console.log('database connected successfully');
    }
});
app.use('/',route);
app.set('view engine','ejs');
app.listen(3000,()=>{
    console.log('server starts on port 3000');
})