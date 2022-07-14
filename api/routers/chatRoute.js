const express = require("express")
const router = express.Router()
const chatController = require('../controllers/chatCtrl')

const checkAuthen = require('../../library/middleWareAuthen')

/**
 * @swagger
 * /api/conversation:
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
 *        description: forbidden
 */
router.post("/conversation/", checkAuthen, chatController.createConversation)


/**
 * @swagger
 * /api/conversation:
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
 *        description: forbidden
 */
router.get("/conversation/", checkAuthen, chatController.getAllConversationOfCurrentUser)

/**
 * @swagger
 * /api/conversation/{receiverId}:
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
 *        description: forbidden
 */
router.get("/conversation/:receiverId", checkAuthen, chatController.getConversationOfCurrentUser)


/**
 * @swagger
 * /api/message:
 *  post:
 *    tags: [Chat]
 *    summary: Create message.
 *    description: create message
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              conversationId:
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
 router.post("/message", checkAuthen, chatController.createMessage)




 /**
 * @swagger
 * /api/conversation/{conversationId}/message:
 *  get:
 *    tags:
 *      - Chat
 *    summary: get all mess of conversation
 *    description: get all mess of conversation
 *    parameters:
 *      - name: skip
 *        in: query
 *        description: number message will be skip
 *        required: false
 *        type: integer
 *    responses:
 *      '200':
 *        description: OK
 *      400:
 *        description: Bad request
 *      403:
 *        description: forbidden
 */
  router.get("/conversation/:conversationId/message", checkAuthen, chatController.getMessage)
module.exports = router