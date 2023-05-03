console.log('this is verifyemail page');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const verifemail =async (name,email,id)=>{
const transporter = nodemailer.createTransport({
    service:'gmail',
    port:567,
    secure:false,
    auth:{
        user:'gursevaksinghgill21@gmail.com',
        pass:'grlnlcnykxqdbjad'
    }
})
const mailOption ={
    from:'gursevaksinghgill21@gmail.com',
    to:email,
    subject:'email verification',
    html:'<p> hii '+name+' click on <a href ="http://127.0.0.1:3000/verify?id='+id+'">Verify</a></p>'
}
transporter.sendMail(mailOption,(error,value)=>{
    if(error){
        console.log(error);
    }
    else{
        console.log(value);
    }
})
}
module.exports = verifemail;