const express = require("express")

const router = express.Router()

const notificationCtrl = require("../controllers/notificationCtrl") 
const checkAuthen = require('../../library/middleWareAuthen')

router.get("/notification", checkAuthen, notificationCtrl.getAllNoti)
router.post("/notification/status", checkAuthen, notificationCtrl.changeStatus)
router.delete("/notification/:notificationId", checkAuthen, notificationCtrl.deleteNoti)
module.exports = router