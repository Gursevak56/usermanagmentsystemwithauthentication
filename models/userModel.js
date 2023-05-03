const mongoose = require('mongoose');
const userSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    PhoneNumber:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    isadmin:{
        type:Number,
        required:true
    },
    isverified:{
        type:Number,
        required:true,
        default:0
    }
})
const User = new mongoose.model("user",userSchema);
module.exports=User;