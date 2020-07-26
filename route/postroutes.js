const express = require('express');
const { post } = require('../controller/post');

const router = express.Router();

router.post('/create', post.createPost);

router.get('/view', post.viewPost);

router.post('/comment', post.commentOnPost);

router.get('/comment/:postid', post.getCommentOnPost);

module.exports = router;