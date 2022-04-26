const { BAD_REQUEST, USER_NOT_FOUND, SUCCESS_OK, GET_SOME_ERROR_WHEN_UPDATE, NOT_THING_CHANGE } = require('../../library/constant')

const { json } = require('express')

const PostModel = require('../../models/post')


exports.getPost = (req, res) => {
    //... phân trang
    PostModel.find()
    .then(posts => {
        posts = posts.reverse()
        
        return res.json({"data": posts})
        
    })
    .catch(e => {
        return res.status(BAD_REQUEST).json({"message": e.message})
    })
}