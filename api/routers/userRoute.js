const express = require("express")
const router = express.Router()
const userController = require('../controllers/userCtrl')

const checkAuthen = require('../../library/middleWareAuthen')

router.post("/account/register", userController.register)
router.post("/account/login", userController.login)
router.post("/account/oauth2",checkAuthen, userController.oauth2)
router.get("/account/:userId", checkAuthen, userController.detail)
// router.put("/account/:id", checkAuthen, userController.updateAccount)
module.exports=router