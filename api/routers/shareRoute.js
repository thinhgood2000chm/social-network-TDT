const express = require("express")
const checkAuthen = require("../../library/middleWareAuthen")
const router = express.Router()
const shareController = require('../controllers/shareCtrl')
/**
 * @swagger
 * /api/post/{postId}/share:
 *  post:
 *    tags: [Post]
 *    summary: Share a post
 *    description: Share a post
 *    parameters:
 *      - name: postId
 *        in: path
 *        description: post id
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
router.post("/post/:postId/share",checkAuthen,  shareController.createShare)

module.exports = router