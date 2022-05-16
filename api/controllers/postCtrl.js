const { NOT_FOUND, BAD_REQUEST, USER_NOT_FOUND, SUCCESS_OK, GET_SOME_ERROR_WHEN_UPDATE, NOT_THING_CHANGE, POST_NOT_FOUND } = require('../../library/constant')

const { json } = require('express')
const fs = require('fs');
const { cloudinary } = require('../../library/cloundinary');
const getLinkYoutube = require('../../library/getLinkYoutube')

const PostModel = require('../../models/post')

// const AccountModel = require('../../models/user')


exports.getPosts = (req, res) => {
    //TODO: scroll loading
    //-- chưa test cái này
    PostModel.find().sort({ createdAt: -1, }).limit(10)
                .populate('createdBy')
                .populate({
                    path : 'comment', 
                    populate : { path : 'createdBy' },
                    // options: {
                    //     limit: 2,
                    //     sort: { created: -1},
                    //     skip: req.params.pageIndex*2
                    // }
                })
        .then(posts => {
            return res.status(SUCCESS_OK).json({ data: posts })
        })
        .catch(e => {
            return res.status(BAD_REQUEST).json({ message: e.message })
        })
}

exports.getPost = (req, res) => {
    let postId = req.params.postID
    PostModel.findById(postId).populate(['createdBy', 'rootPost', 'comment'])
        .then(post => {
            if(!post)
                return res.status(BAD_REQUEST).json({ message: POST_NOT_FOUND })
            
            return res.status(SUCCESS_OK).json({ data: post })
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
    let postImages = req.files
    let image = null
    if (postImages) {
        image = []
        await Promise.all(postImages.map(async (file) => {
            const cloud = await cloudinary.uploader.upload(file.path, {folder : userId})
            image.push(cloud.url)
            // remove temp file in public/upload
            fs.unlinkSync(file.path)
        }))
    }

    // save
    let newPost = new PostModel({
        createdBy: userId,
        content: postContent,
        image: image,
        video: linkVideo
    })
    newPost.save()
        .then((data) => {
            // AccountModel.findByIdAndUpdate(userId, { $push: { post: { rootPostId: data._id } } }, { new: true })
            //     .then(() => {
            //         return res.status(SUCCESS_OK).json({ data: data })
            //     })
            return res.status(SUCCESS_OK).json({ data: data })
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
    let postImages = req.files
    let image = null
    if (postImages) {
        image = []
        await Promise.all(postImages.map(async (file) => {
            const cloud = await cloudinary.uploader.upload(file.path, {folder : userId})
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

    PostModel.findOneAndUpdate({ _id: postID, createdBy: userId }, { $set: newData })
        .then((post) => {
            if (!post)
                return res.status(BAD_REQUEST).json({ message: POST_NOT_FOUND })
            return res.status(SUCCESS_OK).json({ message: 'Cập nhật thành công!', data: post })
        })
        .catch(e => {
            return res.status(BAD_REQUEST).json({ message: e.message })
        })

}

exports.deletePost = (req, res) => {
    let postID = req.params.postID
    let userId = req.userId
    // delete root post
    PostModel.findOneAndRemove({ _id: postID, userId: userId })
        // .then(data => {
        //     // delete share post
        //     PostModel.remove({ rootPost: postID})
        //         .then(() => {
        //             // delete rootPost in account
        //             AccountModel.findByIdAndUpdate(userId, { $pull: { post: { rootPostId: postID } } })
        //             .then(() => {
        //                 // delete sharePost in account
        //                 AccountModel.updateMany( {}, { $pull: { post: { sharePostId: postID } } })
        //                 .then(() => {
        //                     return res.status(SUCCESS_OK).json({ message: 'Xóa thành công!', data: data })
        //                 })
                        
        //             })
        //         })
        // })
        .then(data => {
            if (!data)
                return res.status(BAD_REQUEST).json({ message: POST_NOT_FOUND })

            // delete share post
            PostModel.deleteMany({ rootPost: postID})
                .then((dataShare) => {
                    return res.status(SUCCESS_OK).json({ message: 'Xóa thành công!', data: data, dataShare: dataShare })
                })
        })
        .catch(e => {
            return res.status(BAD_REQUEST).json({ message: e.message })
        })
}