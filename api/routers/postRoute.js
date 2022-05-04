const express = require("express")

const router = express.Router()

const postController = require('../controllers/postCtrl')

const checkAuthen = require('../../library/middleWareAuthen')
const uploadFile = require('../../library/uploadFile')
const postLimiter = require('../../library/postLimiter')

router.get("/post", postController.getPosts)
router.get("/post/:postID", postController.getPost)
router.post("/post", checkAuthen, postLimiter, uploadFile.array('file',12), postController.createPost)
router.put("/post/:postID", checkAuthen, postLimiter, uploadFile.array('file',12), postController.updatePost)
router.delete("/post/:postID", checkAuthen, postController.deletePost)

module.exports = router