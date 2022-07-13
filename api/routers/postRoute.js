const express = require('express')

const router = express.Router()

const postController = require('../controllers/postCtrl')

const checkAuthen = require('../../library/middleWareAuthen')
const postLimiter = require('../../library/postLimiter')
const uploadFile = require('../../library/uploadFile')

/**
 * @swagger
 * /post/{page}:
 *  get:
 *    tags:
 *      - Post
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
 * /post/{postID}:
 *  get:
 *    tags:
 *      - Post
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
router.get('/post/:postID',checkAuthen, postController.getPost)

 /**
 * @swagger
 * /post/friend/{page}:
 *  get:
 *    tags:
 *      - Post
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
 * /post/user/{userID}/{page}:
 *  get:
 *    tags:
 *      - Post
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
 * /post:
 *  post:
 *    tags:
 *      - Post
 *    summary: Post a post
 *    description: Post a post
 *    parameters:
 *      - name: postContent
 *        in: query
 *        description: post content
 *        required: false
 *        type: string
 *      - name: postVideo
 *        in: query
 *        description: link YouTube video
 *        required: false
 *        type: string
 *      - name: postImages
 *        in: query
 *        description: post content
 *        required: false
 *        type: string
 *        format: binary
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
 * /post/{postID}:
 *  put:
 *    tags:
 *      - Post
 *    summary: Update a post
 *    description: Update a post
 *    parameters:
 *      - name: postID
 *        in: path
 *        description: post id
 *        required: true
 *        type: string
 *      - name: postContent
 *        in: query
 *        description: post content
 *        required: false
 *        type: string
 *      - name: postVideo
 *        in: query
 *        description: link YouTube video
 *        required: false
 *        type: string
 *      - name: postImages
 *        in: query
 *        description: post content
 *        required: false
 *        type: string
 *        format: binary
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
 * /post/{postID}:
 *  delete:
 *    tags:
 *      - Post
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