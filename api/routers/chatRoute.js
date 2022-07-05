const express = require("express")
const router = express.Router()
const chatController = require('../controllers/chatCtrl')

const checkAuthen = require('../../library/middleWareAuthen')

/**
 * @swagger
 * /conversation:
 *  post:
 *    tags: [Chat]
 *    summary: Create conversation.
 *    description: create conversation
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              receiverId:
 *                type: string
 * 
 * 
 *    responses:
 *      '200':
 *        description: OK
 *      400:
 *        description: Bad request
 *      403:
 *        description: Not authen
 */
router.post("/conversation/", checkAuthen, chatController.createConversation)


/**
 * @swagger
 * /conversation:
 *  get:
 *    tags: [Chat]
 *    summary: Get conversation.
 *    description: get conversation of current user 
 *    responses:
 *      '200':
 *        description: OK
 *      400:
 *        description: Bad request
 *      403:
 *        description: Not authen
 */
router.get("/conversation/", checkAuthen, chatController.getAllConversationOfCurrentUser)


router.get("/conversation/:receiverId", checkAuthen, chatController.getConversationOfCurrentUser)
module.exports = router