const express = require('express')

const router = express.Router()

const postController = require('../controllers/postCtrl')

const checkAuthen = require('../../library/middleWareAuthen')
const postLimiter = require('../../library/postLimiter')
const uploadFile = require('../../library/uploadFile')

/**
 * @swagger
 * /api/post/{page}:
 *  get:
 *    tags: [Post]
 *    summary: get all post comments
 *    description: get all post comments
 *    parameters:
 *      - name: page
 *        in: path
 *        description: pagination for post
 *        required: false
 *        type: string
 *    responses:
 *      '200':
 *        description: OK
 *      400:
 *        description: Bad request
 *      403:
 *        description: forbidden
 */
router.get('/post/:page?',checkAuthen, postController.getPosts)

 /**
 * @swagger
 * /api/post/{postID}:
 *  get:
 *    tags: [Post]
 *    summary: Get a post
 *    description: Get a post
 *    parameters:
 *      - name: postID
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
router.get('/post/:postID/detail',checkAuthen, postController.getPost)

 /**
 * @swagger
 * /api/post/friend/{page}:
 *  get:
 *    tags: [Post]
 *    description: Get all posts by friends and myself
 *    parameters:
 *      - name: page
 *        in: path
 *        description: pagination for post
 *        required: false
 *        type: string
 *    responses:
 *      '200':
 *        description: OK
 *      400:
 *        description: Bad request
 *      403:
 *        description: forbidden
 */
router.get('/post/friend/:page?',checkAuthen, postController.getPostsOfAllFriends)

 /**
 * @swagger
 * /api/post/user/{userID}/{page}:
 *  get:
 *    tags: [Post]
 *    summary: Get all posts by one person
 *    description: Get all posts by one person
 *    parameters:
 *      - name: userID
 *        in: path
 *        description: user id
 *        required: true
 *        type: string
 *      - name: page
 *        in: path
 *        description: pagination for post
 *        required: false
 *        type: string
 *    responses:
 *      '200':
 *        description: OK
 *      400:
 *        description: Bad request
 *      403:
 *        description: forbidden
 */
router.get('/post/user/:userID/:page?',checkAuthen, postController.getPostsByUserId)

/**
 * @swagger
 * /api/post:
 *  post:
 *    tags: [Post]
 *    summary: Post a post
 *    description: Post a post
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              postContent:
 *                type: string
 *              postVideo:
 *                type: string
 *              postImages:
 *                type: string
 *                format: binary
 *    responses:
 *      '200':
 *        description: OK
 *      400:
 *        description: Bad request
 *      403:
 *        description: forbidden
 */
router.post('/post', checkAuthen, postLimiter, uploadFile.array('postImages'), postController.createPost)

/**
 * @swagger
 * /api/post/{postID}:
 *  put:
 *    tags: [Post]
 *    summary: Update a post
 *    description: Update a post
 *    parameters:
 *      - name: postID
 *        in: path
 *        description: post id
 *        required: true
 *        type: string
 *    requestBody:
 *      content:
 *        required: true
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              postContent:
 *                type: string
 *              postVideo:
 *                type: string
 *              postImages:
 *                type: string
 *                format: binary
 *    responses:
 *      '200':
 *        description: OK
 *      400:
 *        description: Bad request
 *      403:
 *        description: forbidden
 */
router.put('/post/:postID', checkAuthen, postLimiter, uploadFile.array('postImages'), postController.updatePost)

/**
 * @swagger
 * /api/post/{postID}:
 *  delete:
 *    tags: [Post]
 *    summary: Delete a post
 *    description: Delete a post and all its comments
 *    parameters:
 *      - name: postID
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
router.delete('/post/:postID', checkAuthen, postController.deletePost)

module.exports = router