const db = require('../db/query'); 
// const cookie_options =  { "maxAge" : 2700000, "httpOnly": true, "secure": false , "domain" : "localhost"};
// const jwt = require('jsonwebtoken');

const post = {};

post.createPost = async(req,res) =>{
 console.log('Create Post');
 const { post } = req.body;
 const id = 1;
 if(!post){
 	return res.status(400).send('Nothing to post')
 }
 await db.insertRow('post',['post','posted_by'],[post,id]);
 return res.status(200).send('Success')
}

post.viewPost = async(req,res) =>{
 console.log('View Post');
 
 const post = await db.getPost();

 const commentOnPost = await db.getCommentsOnPost(post.rows.map(item=> item.id));
 
 const numberOfCommentsOnPostMap = commentOnPost.rows.reduce(function(a,b){
 	a[b.post_id] = ( a[b.post_id] || 0 ) + 1;
 	return a;
 }, {});
 console.log(numberOfCommentsOnPostMap)
 for(let i=0;i<post.rows.length;i++){
 	if(numberOfCommentsOnPostMap[post.rows[i].id])
 	  post.rows[i].comments = numberOfCommentsOnPostMap[post.rows[i].id];
 	else
 	  post.rows[i].comments = 0;
 }

 return res.status(200).send(post.rows)
}

post.commentOnPost = async(req,res) =>{
 console.log('Comment on Post');

 const { comment, postid } = req.body;
 await db.insertRow('comment',['comment','post_id','commented_by'],[comment,postid,1]);
 return res.status(200).send('Success')

}

post.getCommentOnPost = async(req,res) =>{
 console.log('Login teacher');

 const { postid } = req.params;

 const comment = await db.getCommentOnSpecificPost([postid]);

 return res.status(200).send(comment.rows)
}

module.exports.post = post;