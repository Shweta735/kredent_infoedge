const phone = require('phone');
const moment = require('moment');
const db = require('../db/query'); 


const user = {};

user.register = async(req,res) =>{
 console.log('Register user');
 const { username, phone : phoneNumber, name } = req.body;
 if(!name || !phoneNumber || !username){
 	return res.status(400).send('Provide all the information')
 }
 const phoneChk = phone(phoneNumber, 'IN');
 if(phoneChk.length){
   const user = await db.checkForExistence([username,phoneChk[0]]);
   if(user.rowCount)
     return res.status(400).send('Phone number or username exists');
   await db.insertRow('users',['username','phone','name'],[username,phoneChk[0],name]);
   return res.status(200).send('Success');
 }
 return res.status(400).send('Invalid phone number')
}

user.login = async(req,res) =>{
 console.log('Login user');

 const { username, phone: phoneNumber } = req.body;

 if(!username || !phone){
 	return res.status(400).send('Mandatory data missing')
 }
 const phoneChk = phone(phoneNumber, 'IN'); 
 const user = await db.selectOnKeys('users',['username', 'phone'],[username,phoneChk[0]]);
 if(!user.rowCount){
 	return res.status(400).send('Incorrect username or password')
 }
 return res.status(200).send({id : user.rows[0].id})
}

module.exports.user = user;