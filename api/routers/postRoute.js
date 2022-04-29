const express = require("express")
const router = express.Router()
const postController = require('../controllers/postCtrl')

const checkAuthen = require('../../library/middleWareAuthen')

router.get("/post", postController.getPosts)
router.get("/post/:postID", postController.getPost)
router.delete("/post/:postID", checkAuthen, postController.deletePost)