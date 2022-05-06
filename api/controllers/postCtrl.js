const { BAD_REQUEST, USER_NOT_FOUND, SUCCESS_OK, GET_SOME_ERROR_WHEN_UPDATE, NOT_THING_CHANGE } = require('../../library/constant')

const { json } = require('express')
const fs = require('fs');
const { cloudinary } = require('../../library/cloundinary');
const getLinkYoutube = require('../../library/getLinkYoutube')

const PostModel = require('../../models/post')
const AccountModel = require('../../models/user')


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
    let postId = req.params.postID
    PostModel.findById(postId)
        .then(post => {
            res.status(SUCCESS_OK).json({ data: post })
        })
        .catch(e => {
            return res.status(BAD_REQUEST).json({ message: e.message })
        })
}

exports.createPost = async (req, res) => {
    let userId = req.userId
    let { postContent, postVideo } = req.body

    // video
    let linkVideo = null
    if (postVideo) {
        linkVideo = getLinkYoutube(postVideo);
    }

    // upload image
    let postImages = req.files // file đối với single , files đối với multi
    console.log(postImages)
    let image = null
    if (postImages) {
        image = []
        await Promise.all(postImages.map(async (file) => {
            const cloud = await cloudinary.uploader.upload(file.path)
            image.push(cloud.url)
            // remove temp file in public/upload
            fs.unlinkSync(file.path)
        }))
    }

    // save
    let newPost = new PostModel({
        userId: userId,
        content: postContent,
        image: image,
        video: linkVideo
    })
    newPost.save()
        .then((data) => {
            AccountModel.findByIdAndUpdate(userId, { $push: { post: { rootPostId: data._id } } }, { new: true })
                .then(() => {
                    return res.status(SUCCESS_OK).json({ data: data })
                })

        })
        .catch(e => {
            return res.status(BAD_REQUEST).json({ message: e.message })
        })
}

exports.updatePost = async (req, res) => {
    let userId = req.userId
    let postID = req.params.postID
    let { postContent, postVideo } = req.body

    // video
    let linkVideo = null
    if (postVideo) {
        linkVideo = getLinkYoutube(postVideo)
    }

    // image
    let postImages = req.files // file đối với single , files đối với multi
    let image = null
    if (postImages) {
        image = []
        await Promise.all(postImages.map(async (file) => {
            const cloud = await cloudinary.uploader.upload(file.path)
            image.push(cloud.url)
            fs.unlinkSync(file.path)
        }))
    }

    // save
    newData = {
        content: postContent,
        image: image,
        video: linkVideo
    }

    PostModel.findOneAndUpdate({ _id: postID, userId: userId }, { $set: newData })
        .then((post) => {
            return res.status(SUCCESS_OK).json({ message: 'Cập nhật thành công!', data: post })
        })
        .catch(e => {
            return res.status(BAD_REQUEST).json({ message: e.message })
        })

}

exports.deletePost = (req, res) => {
    let postID = req.params.postID
    let userId = req.userId
    PostModel.findOneAndRemove({ _id: postID, userId: userId })
        .then(data => {
            // AccountModel.updateMany({ }
            //                         , { $pull: { post: { rootPostId: postID }, post: { sharePostId: postID } } }
            //                         )
            AccountModel.findByIdAndUpdate(userId, { $pull: { post: { rootPostId: postID } } })
                .then(() => {
                    return res.status(SUCCESS_OK).json({ message: 'Xóa thành công!', data: data })
                })
        })
        .catch(e => {
            return res.status(BAD_REQUEST).json({ message: e.message })
        })
}