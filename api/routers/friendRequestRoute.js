const express = require("express")
const router = express.Router()

const checkAuthen = require('../../library/middleWareAuthen')
const friendCrtl = require("../controllers/friendRequestCtrl")

router.post("/requestFriend/:idUserWantsendRequest",checkAuthen, friendCrtl.createRequestNewFriend)
router.post("/requestFriend/reply/:idUserInQueueforAccept", checkAuthen, friendCrtl.acceptRequest)
router.get("/friend/:userId", checkAuthen, friendCrtl.listAll)
router.post("/requestFriend/deny/:idUserInQueueforAccept", checkAuthen, friendCrtl.deniRequest)
router.get("/requestFriend/", checkAuthen, friendCrtl.listAllFriendRequest)
module.exports = router