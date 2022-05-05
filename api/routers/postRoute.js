const express = require("express")

const router = express.Router()

const postController = require('../controllers/postCtrl')

const checkAuthen = require('../../library/middleWareAuthen')
const postLimiter = require('../../library/postLimiter')

router.get("/post", postController.getPosts)
router.get("/post/:postID", postController.getPost)
router.post("/post", checkAuthen, postLimiter, postController.createPost)
router.put("/post/:postID", checkAuthen, postLimiter, postController.updatePost)
router.delete("/post/:postID", checkAuthen, postController.deletePost)

module.exports = router