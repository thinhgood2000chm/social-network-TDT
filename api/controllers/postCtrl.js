const { BAD_REQUEST, USER_NOT_FOUND, SUCCESS_OK, GET_SOME_ERROR_WHEN_UPDATE, NOT_THING_CHANGE } = require('../../library/constant')

const { json } = require('express')
const fs = require('fs');
const { cloudinary } = require('../../library/cloundinary');

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

    //- upload video with link youtube
    let videoUploadNew = null
    if (postVideo) {
        let pathVideo = 'https://www.youtube.com/embed/'
        let video_id = postVideo.slice(32)
        // lấy id của youtube ( vì một số id có thêm chuỗi kí tự = sẽ ko tách thủ công được )
        let ampersandPosition = video_id.indexOf('&');
        if (ampersandPosition != -1) {
            video_id = video_id.substring(0, ampersandPosition);
        }
        videoUploadNew = pathVideo + video_id
    }
    //- upload image
    postImages = req.files;// file đối với single , files đối với multi  
    let image = null
    if (postImages) {
        image = []
        await Promise.all(images.map(async (file) => {
            const cloud = await cloudinary.uploader.upload(file.path)
            image.push(cloud.url)
        }))
    }

    let newPost = new PostModel({
        userId: userId,
        content: postContent,
        image: image,
        video: videoUploadNew
    })
    newPost.save()
        .then((data) => {
            AccountModel.findByIdAndUpdate(userId, { $push: { post: { rootPostId: data._id } } }, { new: true })
                .then((accountUpdate) => {
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
    if (postVideo.includes("watch")) {
        var pathVideo = 'https://www.youtube.com/embed/'
        var video_id = postVideo.slice(32)
        var ampersandPosition = video_id.indexOf('&');
        if (ampersandPosition != -1) {
            video_id = video_id.substring(0, ampersandPosition);
        }

        var videoUploadNew = pathVideo + video_id
    } else if (!videoUpload) {
        var pathVideo = 'https://www.youtube.com/embed/'
        videoUploadNew = pathVideo
    }
    else
        videoUploadNew = postVideo

    // image
    postImages = req.files;// file đối với single , files đối với multi  
    let image = null
    if (postImages) {
        image = []
        await Promise.all(images.map(async (file) => {
            const cloud = await cloudinary.uploader.upload(file.path)
            image.push(cloud.url)
        }))
    }

    newData = {
        content: postContent,
        image: image,
        video: videoUploadNew
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
            AccountModel.findByIdAndUpdate(userId, { $pull: { post: { rootPostId: postID } } })
                .then((accountUpdate) => {
                    return res.status(SUCCESS_OK).json({ message: 'Xóa thành công!', data: data })
                })
        })
        .catch(e => {
            return res.status(BAD_REQUEST).json({ message: e.message })
        })
}