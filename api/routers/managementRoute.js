const express = require('express')
const router = express.Router()
const managementController = require('../controllers/managementCtrl')

const checkAuthen = require('../../library/middleWareAuthen')

router.get('/management/account/', checkAuthen, managementController.getAllAccount)
router.post('/management/account/:userId', checkAuthen, managementController.updateAccount)
module.exports = router