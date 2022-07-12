const express = require("express")

const router = express.Router()

const notificationCtrl = require("../controllers/notificationCtrl") 
const checkAuthen = require('../../library/middleWareAuthen')


 /**
 * @swagger
 * /notification:
 *  get:
 *    tags:
 *      - Notification
 *    summary: Get all notification
 *    description: Get all notification
 *    responses:
 *      '200':
 *        description: OK
 *      400:
 *        description: Bad request
 *      403:
 *        description: forbidden
 */
router.get("/notification", checkAuthen, notificationCtrl.getAllNoti)

 /**
 * @swagger
 * /notification/status:
 *  post:
 *    tags:
 *      - Notification
 *    summary: Change status notification
 *    description: Change status notification from `false` to `true`
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              notificationId:
 *                type: string
 *              text:
 *                type: string
 * 
 *    responses:
 *      '200':
 *        description: OK
 *      400:
 *        description: Bad request
 *      403:
 *        description: forbidden
 */
router.post("/notification/status", checkAuthen, notificationCtrl.changeStatus)
 /**
 * @swagger
 * /notification/status:
 *  delete:
 *    tags:
 *      - Notification
 *    summary: Delete notification
 *    description: Soft delete notification
 *    parameters:
 *      - name: notificationId
 *        in: path
 *        description: id of notification want to delete
 *        required: true
 *        type: string
 *    responses:
 *      '200':
 *        description: OK
 *      400:
 *        description: Bad request
 *      403:
 *        description: forbidden
 */
router.delete("/notification/:notificationId", checkAuthen, notificationCtrl.deleteNoti)
module.exports = router

