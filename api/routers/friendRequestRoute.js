const express = require("express")
const router = express.Router()

const checkAuthen = require('../../library/middleWareAuthen')
const friendCrtl = require("../controllers/friendRequestCtrl")

router.post("/requestFriend/:idUserWantsendRequest",checkAuthen, friendCrtl.createRequestNewFriend)
router.post("/requestFriend/reply/:idUserInQueueRequest", checkAuthen, friendCrtl.acceptOrDelete)
module.exports = router