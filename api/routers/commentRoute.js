const express = require('express')
const router = express.Router()
const commentController = require('../controllers/commentCtrl')

const checkAuthen = require('../../library/middleWareAuthen')

/**
 * @swagger
 * /api/post/{postId}/comment:
 *  post:
 *    tags: [Post]
 *    summary: Comment a post
 *    description: Comment a post
 *    parameters:
 *      - name: postId
 *        in: path
 *        description: post id
 *        required: true
 *        type: string
 *      - name: content
 *        in: query
 *        description: comment content
 *        required: true
 *        type: string
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              content:
 *                type: string
 *    responses:
 *      '200':
 *        description: OK
 *      400:
 *        description: Bad request
 *      403:
 *        description: forbidden
 */
router.post('/post/:postId/comment/', checkAuthen, commentController.createComment)

/**
 * @swagger
 * /api/post/{postId}/comment:
 *  delete:
 *    tags: [Post]
 *    summary: Delete a comment
 *    description: Delete a comment
 *    parameters:
 *      - name: postId
 *        in: path
 *        description: post id
 *        required: true
 *        type: string
 *      - name: commentId
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
router.delete('/post/:postId/comment/:commentId', checkAuthen, commentController.deleteComment)

/**
 * @swagger
 * /api/post/{postId}/comment:
 *  get:
 *    tags: [Post]
 *    summary: get all post comments
 *    description: get all post comments
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
router.get('/post/:postId/comment', checkAuthen, commentController.listComment)
module.exports = router