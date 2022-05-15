const express = require("express")
const router = express.Router()

const checkAuthen = require('../../library/middleWareAuthen')
const friendCrtl = require("../controllers/friendRequestCtrl")

router.post("/requestFriend/:idUserWantsendRequest",checkAuthen, friendCrtl.createRequestNewFriend)
router.post("/requestFriend/reply/:idUserInQueueforAccept", checkAuthen, friendCrtl.acceptOrDelete)
router.get("/requestFriend/", checkAuthen, friendCrtl.listAll)
module.exports = router