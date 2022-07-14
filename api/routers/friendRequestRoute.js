const express = require("express")
const router = express.Router()

const checkAuthen = require('../../library/middleWareAuthen')
const friendCrtl = require("../controllers/friendRequestCtrl")
 /**
 * @swagger
 * /api/requestFriend/{idUserWantsendRequest}:
 *  post:
 *    tags:
 *      - Friend
 *    summary: Create friend request
 *    description: Send friend request to other user
 *    parameters:
 *      - name: idUserWantsendRequest
 *        in: path
 *        description: id of user want to send request
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
router.post("/requestFriend/:idUserWantsendRequest",checkAuthen, friendCrtl.createRequestNewFriend)
 /**
 * @swagger
 * /api/requestFriend/reply/{idUserInQueueforAccept}:
 *  post:
 *    tags:
 *      - Friend
 *    summary: Accept friend request
 *    description: Accept friend request
 *    parameters:
 *      - name: idUserInQueueforAccept
 *        in: path
 *        description: id of user send request
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
router.post("/requestFriend/reply/:idUserInQueueforAccept", checkAuthen, friendCrtl.acceptRequest)
 /**
 * @swagger
 * /api/friend/{userId}:
 *  get:
 *    tags:
 *      - Friend
 *    summary: get all friend 
 *    description: get all friend 
 *    parameters:
 *      - name: userId
 *        in: path
 *        description: id of user want to see friend
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
router.get("/friend/:userId", checkAuthen, friendCrtl.listAll)
 /**
 * @swagger
 * /api/requestFriend/deny/{idUserInQueueforAccept}:
 *  post:
 *    tags:
 *      - Friend
 *    summary: Deny friend request
 *    description: Deny friend request
 *    parameters:
 *      - name: idUserInQueueforAccept
 *        in: path
 *        description: id of user send request
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
router.post("/requestFriend/deny/:idUserInQueueforAccept", checkAuthen, friendCrtl.deniRequest)


 /**
 * @swagger
 * /api/requestFriend/:
 *  get:
 *    tags:
 *      - Friend
 *    summary: get all friend request
 *    description: get all friend request
 *    responses:
 *      '200':
 *        description: OK
 *      400:
 *        description: Bad request
 *      403:
 *        description: forbidden
 */
router.get("/requestFriend/", checkAuthen, friendCrtl.listAllFriendRequest)



 /**
 * @swagger
 * /api/deleteFriend/{friendId}:
 *  delete:
 *    tags:
 *      - Friend
 *    summary: Delete friend
 *    description: Delete friend
 *    parameters:
 *      - name: friendId
 *        in: path
 *        description: id of friend 
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
router.delete("/deleteFriend/:friendId", checkAuthen, friendCrtl.deleteFriend)

module.exports = router