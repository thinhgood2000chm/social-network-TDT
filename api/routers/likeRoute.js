const express = require("express")
const checkAuthen = require("../../library/middleWareAuthen")
const router = express.Router()

const likeCtrl = require('../controllers/likeCtrl')

router.post('/post/:postId/like', checkAuthen, likeCtrl.likePost)

module.exports = router