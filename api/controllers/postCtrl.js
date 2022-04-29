const { BAD_REQUEST, USER_NOT_FOUND, SUCCESS_OK, GET_SOME_ERROR_WHEN_UPDATE, NOT_THING_CHANGE } = require('../../library/constant')

const { json } = require('express')

const PostModel = require('../../models/post')


exports.getPosts = (req, res) => {
    //TODO: scroll loading
    PostModel.find()
        .then(posts => {
            posts = posts.reverse()

            return res.status(SUCCESS_OK).json({ data: posts })
        })
        .catch(e => {
            return res.status(BAD_REQUEST).json({ message: e.message })
        })
}

exports.getPost = (req, res) => {
    let postID = req.params.id
    PostModel.findById(postID)
        .then(post => {
            res.status(SUCCESS_OK).json({ data: post })
        })
        .catch(e => {
            return res.status(BAD_REQUEST).json({ message: e.message })
        })
}

exports.deletePost = (req, res) => {
    let postID = req.params.id
    PostModel.findByIdAndRemove(postID)
        .then(post => {
            res.status(SUCCESS_OK).json({ message: 'Xóa thành công!', data: post })
        })
        .catch(e => {
            return res.status(BAD_REQUEST).json({ message: e.message })
        })
}