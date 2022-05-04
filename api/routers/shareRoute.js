const express = require("express")
const checkAuthen = require("../../library/middleWareAuthen")
const router = express.Router()
const shareController = require('../controllers/shareCtrl')

router.post("/post/:postId/share",checkAuthen,  shareController.createShare)

module.exports = router