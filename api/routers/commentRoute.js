const express = require("express")
const router = express.Router()
const commentController = require('../controllers/commentCtrl')

const checkAuthen = require('../../library/middleWareAuthen')

router.post("/post/:postId/comment/", checkAuthen, commentController.createComment)
router.delete("/post/:postId/comment/:commentId", checkAuthen, commentController.deleteComment)
router.get("/post/:postId/comment", checkAuthen, commentController.listComment)
module.exports = router