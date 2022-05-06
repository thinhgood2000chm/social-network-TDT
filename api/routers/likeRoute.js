const express = require("express")
const checkAuthen = require("../../library/middleWareAuthen")
const router = express.Router()
const upload = require('../../library/uploadFile')
const likeCtrl = require('../controllers/likeCtrl')

router.post('/post/:postId/like',upload.single('test'), checkAuthen, likeCtrl.likePost)

module.exports = router