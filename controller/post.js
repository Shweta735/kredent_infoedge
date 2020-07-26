const db = require('../db/query'); 
const moment = require('moment');

const post = {};

post.createPost = async(req,res) =>{
 console.log('Create Post');
 const { post, id } = req.body;
 if(!post){
 	return res.status(400).send('Nothing to post')
 }
 await db.insertRow('post',['post','posted_by'],[post,id]);
 return res.status(200).send('Success')
}

post.viewPost = async(req,res) =>{
 console.log('View Post');
 
 const post = await db.getPost();
 if(post.rowCount){
   const commentOnPost = await db.getCommentsOnPost(post.rows.map(item=> item.id));
   const numberOfCommentsOnPostMap = commentOnPost.rows.reduce(function(a,b){
 	  a[b.post_id] = ( a[b.post_id] || 0 ) + 1;
 	  return a;
    }, {});
    for(let i=0;i<post.rows.length;i++){
 	post.rows[i].posted_on = moment(post.rows[i].posted_on,'DD-MM-YYYY HH:mm:ss A').format('DD-MM-YYYY HH:mm:ss A');
 	if(numberOfCommentsOnPostMap[post.rows[i].id])
 	  post.rows[i].comments = numberOfCommentsOnPostMap[post.rows[i].id];
 	else
 	  post.rows[i].comments = 0;
   }
  }

 return res.status(200).send(post.rows)
}

post.commentOnPost = async(req,res) =>{
 console.log('Comment on Post');

 const { comment, postid, id } = req.body;
 await db.insertRow('comment',['comment','post_id','commented_by'],[comment,postid,id]);
 return res.status(200).send('Success')

}

post.getCommentOnPost = async(req,res) =>{
 console.log('Get comments on post');

 const { postid } = req.params;

 const comment = await db.getCommentOnSpecificPost([postid]);
 for(let i=0;i<comment.rows.length;i++){
 	comment.rows[i].commented_on = moment(comment.rows[i].commented_on,'DD-MM-YYYY HH:mm:ss A').format('DD-MM-YYYY HH:mm:ss A')
 }
 return res.status(200).send(comment.rows)
}

module.exports.post = post;