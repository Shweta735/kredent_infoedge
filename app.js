const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const userroutes = require('./route/userroutes');
const postroutes = require('./route/postroutes');

const db = require('./db/query');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.set('view engine','ejs')


app.use(express.static(path.join(__dirname, 'public')));
console.log(path.join(__dirname, 'public'))

db.init();

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname,'public/html/index.html'));
});

app.get('/register',(req,res)=>{ 
  res.sendFile(path.join(__dirname,'public/html/register.html'));
});

app.get('/post',(req,res)=>{  
  res.sendFile(path.join(__dirname,'public/html/post.html'));
});

app.get('/create_post',(req,res)=>{  
  res.sendFile(path.join(__dirname,'public/html/create_post.html'));
});

app.get('/post_comment',(req,res)=>{  
  res.sendFile(path.join(__dirname,'public/html/post_comment.html'));
});

app.get('/view_comment',(req,res)=>{  
  res.sendFile(path.join(__dirname,'public/html/view_comment.html'));
});

const userBasicPath = '/api/v1/user';
const postBasicPath = '/api/v1/post'

app.use(userBasicPath,userroutes);

app.use(postBasicPath,postroutes);

app.use((req, res) => res.status(404).send('Not Found'));

app.listen(process.env.PORT || 5000, ()=> console.log("Connected"))