const express = require("express")
const router = express.Router()
const userController = require('../controllers/userCtrl')

const checkAuthen = require('../../library/middleWareAuthen')

router.post("/account/register", userController.register)
router.post("/account/login", userController.login)
router.post("/account/oauth2", checkAuthen, userController.oauth2)
router.get("/account/:userId", checkAuthen, userController.detail)
router.put("/account/:userId", checkAuthen, userController.updateAccount)
router.put('/account/:userId/password', checkAuthen, userController.changePassword)
router.get("/profile/:userId", checkAuthen, userController.profile)
module.exports = router