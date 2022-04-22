const express = require("express")
const router = express.Router()
const userController = require('../controllers/userCtrl')

const checkAuthen = require('../../library/middleWareAuthen')

router.post("/register", userController.register)
router.post("/login", userController.login)
router.post("/oauth2",checkAuthen, userController.oauth2)
module.exports=router