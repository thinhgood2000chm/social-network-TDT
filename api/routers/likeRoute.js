const express = require("express")
const checkAuthen = require("../../library/middleWareAuthen")
const router = express.Router()
const likeCtrl = require('../controllers/likeCtrl')
/**
 * @swagger
 * /api/post/{postId}/like:
 *  post:
 *    tags: [Post]
 *    summary: Like a post
 *    description: Like a post
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
router.post('/post/:postId/like', checkAuthen, likeCtrl.likePost)

module.exports = router