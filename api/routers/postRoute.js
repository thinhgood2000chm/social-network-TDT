const express = require("express")
const router = express.Router()
const postController = require('../controllers/postCtrl')

const checkAuthen = require('../../library/middleWareAuthen')

router.get("/post", postController.getPost)
router.post("/post", checkAuthen, postController.addPost)