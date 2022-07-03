const express = require("express")
const router = express.Router()
const userController = require('../controllers/userCtrl')

const checkAuthen = require('../../library/middleWareAuthen')
const upload = require("../../library/uploadFile")

// ko sử dụng userid mà dùng trực tiếp thông tin người dùng được gửi qua bearer token
router.post("/account/register", userController.register)
router.post("/account/login", userController.login)
router.post("/account/oauth2", userController.oauth2)
router.get("/account/", checkAuthen, userController.detail)
router.put("/account/:userId", checkAuthen, upload.fields([{name: 'image', maxCount: 1},{name: 'backgroundPicture', maxCount: 1}]), userController.updateAccount)
router.put('/account/password', checkAuthen, userController.changePassword)
router.get("/profile/:userId", checkAuthen, userController.profile)
router.get("/account/:name", checkAuthen, userController.findUser)
module.exports = router