const express = require('express')
const router = express.Router()
const userController = require('../controllers/userCtrl')

const checkAuthen = require('../../library/middleWareAuthen')
const upload = require('../../library/uploadFile')

// ko sử dụng userid mà dùng trực tiếp thông tin người dùng được gửi qua bearer token

/**
 * @swagger
 * /api/account/register:
 *  post:
 *    tags: [Account]
 *    summary: Register account.
 *    description: register account for admin or older student
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              givenName:
 *                type: string
 *              familyName:
 *                type: string
 *              username:
 *                type: string
 *              password:
 *                type: string
 * 
 *    responses:
 *      '200':
 *        description: A successful response
 *      400:
 *        description: Bad request
 *      403:
 *        description: forbidden
 */
router.post("/account/register", userController.register)

/**
 * @swagger
 * /api/account/login:
 *  post:
 *    tags: [Account]
 *    summary: Login.
 *    description: Login
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              username:
 *                type: string
 *                required: true
 *              password:
 *                type: string
 *                required: true
 * 
 *    responses:
 *      '200':
 *        description: A successful response
 *      400:
 *        description: Bad request
 *      403:
 *        description: forbidden
 */
router.post("/account/login", userController.login)

/**
 * @swagger
 * /api/account/oauth2:
 *  post:
 *    tags: [Account]
 *    summary: Login.
 *    description: Login
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              tokenId:
 *                type: string
 *                required: true
 *     
 *    responses:
 *      '200':
 *        description: A successful response
 *      400:
 *        description: Bad request
 *      403:
 *        description: forbidden
 */
router.post("/account/oauth2", userController.oauth2)

/**
 * @swagger
 * /api/account:
 *  get:
 *    tags: [Account]
 *    summary: Detail user.
 *    description:  Detail user
 *    responses:
 *      '200':
 *        description: A successful response
 *      400:
 *        description: Bad request
 *      403:
 *        description: forbidden
 */
router.get("/account/", checkAuthen, userController.detail)

/**
 * @swagger
 * /api/account/{userId}:
 *  put:
 *    tags: [Account]
 *    summary: Update account.
 *    description: Update account.
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              givenName:
 *                type: string
 *                required: false
 *              familyName:
 *                type: string
 *                required: false
 *              username:
 *                type: string
 *                required: false
 *              biography:
 *                type: string
 *                required: false
 *              className:
 *                type: string
 *                required: false
 *              faculty:
 *                type: string
 *                required: false
 *              birthday:
 *                type: string
 *                required: false
 *              phone:
 *                type: string
 *                required: false
 *              gender:
 *                type: string
 *                required: false
 * 
 *    parameters:
 *      - name: userId
 *        in: path
 *        description: userId
 *        required: true
 *        type: string
 *    responses:
 *      '200':
 *        description: A successful response
 *      400:
 *        description: Bad request
 *      403:
 *        description: forbidden
 */
router.put("/account/:userId", checkAuthen, upload.fields([{ name: 'image', maxCount: 1 }, { name: 'backgroundPicture', maxCount: 1 }]), userController.updateAccount)

/**
 * @swagger
 * /api/account/password/change:
 *  post:
 *    tags: [Account]
 *    summary: Change password.
 *    description:  Change password
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              newPassword:
 *                type: string
 *                required: true
 *              oldPassword:
 *                type: string
 *                required: true
 *     
 *    responses:
 *      '200':
 *        description: A successful response
 *      400:
 *        description: Bad request
 *      403:
 *        description: forbidden
 */
router.put('/account/password/change', checkAuthen, userController.changePassword)

/**
 * @swagger
 * /api/account/password/create:
 *  post:
 *    tags: [Account]
 *    summary: Create password.
 *    description:  Create password to login with email and password
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              newPassword:
 *                type: string
 *                required: true
 *     
 *    responses:
 *      '200':
 *        description: A successful response
 *      400:
 *        description: Bad request
 *      403:
 *        description: forbidden
 */
router.put('/account/password/create', checkAuthen, userController.createPassword)

/**
 * @swagger
 * /api/profile/{userId}:
 *  get:
 *    tags: [Account]
 *    summary: Profile.
 *    description: Show profile of user.
 *    parameters:
 *      - name: userId
 *        in: path
 *        description: userId
 *        required: true
 *        type: string
 *    responses:
 *      '200':
 *        description: A successful response
 *      400:
 *        description: Bad request
 *      403:
 *        description: forbidden
 */
router.get("/profile/:userId", checkAuthen, userController.profile)

/**
 * @swagger
 * /api/account/{name}:
 *  get:
 *    tags: [Account]
 *    summary: Profile.
 *    description: Show profile of user.
 *    parameters:
 *      - name: name
 *        in: path
 *        description: name of user
 *        required: true
 *        type: string
 *    responses:
 *      '200':
 *        description: A successful response
 *      400:
 *        description: Bad request
 *      403:
 *        description: forbidden
 */
router.get("/account/:name", checkAuthen, userController.findUser)
module.exports = router