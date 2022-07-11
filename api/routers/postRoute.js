const express = require('express')

const router = express.Router()

const postController = require('../controllers/postCtrl')

const checkAuthen = require('../../library/middleWareAuthen')
const postLimiter = require('../../library/postLimiter')
const uploadFile = require('../../library/uploadFile')

router.get('/post/:page?',checkAuthen, postController.getPosts)
router.get('/post/:postID',checkAuthen, postController.getPost)
router.get('/post/friend/:page?',checkAuthen, postController.getPostsOfAllFriends)
router.get('/post/user/:userID/:page?',checkAuthen, postController.getPostsByUserId)
router.post('/post', checkAuthen, postLimiter, uploadFile.array('postImages'), postController.createPost)
router.put('/post/:postID', checkAuthen, postLimiter, uploadFile.array('postImages'), postController.updatePost)
router.delete('/post/:postID', checkAuthen, postController.deletePost)
//getPostsOfAllFriends
module.exports = router