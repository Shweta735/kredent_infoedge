
const db = require('../db/query'); 
// const cookie_options =  { "maxAge" : 2700000, "httpOnly": true, "secure": false , "domain" : "localhost"};
// const jwt = require('jsonwebtoken');

const user = {};

user.register = async(req,res) =>{
 console.log('Register teacher');
 const { username, phone, name } = req.body;
 if(!name || !phone || !username){
 	return res.status(400).send('Mandatory data missing')
 }
 //add valid phone check
 await db.insertRow('users',['username','phone','name'],[username,phone,name]);
 return res.status(200).send('Success')
}

user.login = async(req,res) =>{
 console.log('Login teacher');

 const { username, phone } = req.body;

 if(!username || !phone){
 	return res.status(400).send('Mandatory data missing')
 }

 const user = await db.selectOnKeys('users',['username', 'phone'],[username,phone]);
 if(!user.rowCount){
 	return res.status(400).send('Incorrect username or password')
 }
 const post = await db.getPost();
 // console.log(post.rows)
 // const { id, schoolid } = teacher.rows[0];
 // const token = jwt.sign({id: id,school : schoolid}, 'ABCD', { expiresIn: '7d' });
 // res.cookie('X-Token', token, cookie_options);
 // return res.redirect(`http://${req.headers.host}/post`);
 res.status(200).send('Success')
}

module.exports.user = user;