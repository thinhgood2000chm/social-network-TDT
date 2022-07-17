const { NOT_FOUND, BAD_REQUEST, USER_NOT_FOUND, SUCCESS_OK, GET_SOME_ERROR_WHEN_UPDATE, NOT_THING_CHANGE, POST_NOT_FOUND } = require('../../library/constant')
const { LIMIT_PAGING } = require('../../library/constant')
const { json } = require('express')
const fs = require('fs');
const { cloudinary } = require('../../library/cloundinary');
const getLinkYoutube = require('../../library/getLinkYoutube')

const PostModel = require('../../models/post');
const CommentModel = require('../../models/comment')
const UserModel = require('../../models/user')
const { post } = require('../routers/userRoute');


exports.getPosts = (req, res) => {
    const userId = req.userId

    PostModel.find().sort({ createdAt: -1, }).limit(LIMIT_PAGING).skip((req.params.page || 0) * LIMIT_PAGING)
        .populate('createdBy')
        // .populate({path:'likedBy',
        // options: {
        //     limit: 10,
        //     sort: { created: -1},
        //     skip: req.params.pageIndex*10
        // }
        // })
        .populate({
            path: 'commentPost',
            populate: { path: 'createdBy' },
            options: {
                limit: 2,
                sort: { createdAt: -1 },
            }
        })
        .populate({
            path: 'rootPost',
            populate: { path: 'createdBy' }
        })
        .then(posts => {

            for (var index = 0; index < posts.length; index++) {
                posts[index] = posts[index].toJSON()
                if (posts[index].likedBy.toString().includes(userId)) {
                    posts[index].isLikePost = true // isLikePost dùng để kiểm tra xem người hiện tại đang đăng nhập đã like bài viết hay chưa
                    // posts[index].isLikePost
                }
                else {
                    posts[index].isLikePost = false
                }
            }

            return res.status(SUCCESS_OK).json(posts)
        })
}

exports.getPostsByUserId = (req, res) => {
    const userId = req.params.userID
    PostModel.find({ createdBy: userId })
        .sort({ createdAt: -1, }).limit(LIMIT_PAGING).skip((req.params.page || 0) * LIMIT_PAGING)
        .populate('createdBy')
        .populate({
            path: 'commentPost',
            populate: { path: 'createdBy' },
            options: {
                limit: 2,
                sort: { createdAt: -1 },
                skip: req.params.pageIndex * 2
            }
        })
        .populate({
            path: 'rootPost',
            populate: { path: 'createdBy' }
        })
        .then(posts => {
            for (var index = 0; index < posts.length; index++) {
                posts[index] = posts[index].toJSON()
                if (posts[index].likedBy.toString().includes(userId)) {
                    posts[index].isLikePost = true // isLikePost dùng để kiểm tra xem người hiện tại đang đăng nhập đã like bài viết hay chưa
                    // posts[index].isLikePost
                }
                else {
                    posts[index].isLikePost = false
                }
            }
            return res.status(SUCCESS_OK).json(posts)
        })
        .catch(e => {
            return res.status(BAD_REQUEST).json({ message: e.message })
        })
}

exports.getPostsOfAllFriends = (req, res) => {
    const userId = req.userId

    UserModel.findById(userId)
        .then(user => {
            PostModel.find({ $or: [{ createdBy: userId }, { createdBy: { $in: user.friends } }] })
                .sort({ createdAt: -1, }).limit(LIMIT_PAGING).skip((req.params.page || 0) * LIMIT_PAGING)
                .populate('createdBy')
                .populate({
                    path: 'commentPost',
                    populate: { path: 'createdBy' },
                    options: {
                        limit: 2,
                        sort: { createdAt: -1 },
                        skip: req.params.pageIndex * 2
                    }
                })
                .populate({
                    path: 'rootPost',
                    populate: { path: 'createdBy' }
                })
                .then(posts => {
                    for (var index = 0; index < posts.length; index++) {
                        posts[index] = posts[index].toJSON()
                        if (posts[index].likedBy.toString().includes(userId)) {
                            posts[index].isLikePost = true // isLikePost dùng để kiểm tra xem người hiện tại đang đăng nhập đã like bài viết hay chưa
                            // posts[index].isLikePost
                        }
                        else {
                            posts[index].isLikePost = false
                        }
                    }
                    return res.status(SUCCESS_OK).json(posts)
                })
                .catch(e => {
                    return res.status(BAD_REQUEST).json({ message: e.message })
                })
        })

}

exports.getPost = (req, res) => {
    let postId = req.params.postID
    PostModel.findById(postId).populate(['createdBy', 'rootPost', 'commentPost'])
        .then(post => {
            if (!post)
                return res.status(BAD_REQUEST).json({ message: POST_NOT_FOUND })

            post.len = 10
            return res.status(SUCCESS_OK).json(post)
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
    let imageId = null
    if (postImages) {
        image = []
        imageId = []
        await Promise.all(postImages.map(async (file) => {
            const cloud = await cloudinary.uploader.upload(file.path, { folder: userId })
            image.push(cloud.url)
            imageId.push(cloud.public_id)
            // remove temp file in public/upload
            fs.unlinkSync(file.path)
        }))
    }

    // save
    let newPost = new PostModel({
        createdBy: userId,
        content: postContent,
        image: image,
        imageId: imageId,
        video: linkVideo
    })
    newPost.save()
        .then((newPost) => {
            // AccountModel.findByIdAndUpdate(userId, { $push: { post: { rootPostId: data._id } } }, { new: true })
            //     .then(() => {
            //         return res.status(SUCCESS_OK).json({ data: data })
            //     })

            newPost.populate('createdBy').then((newPost) => {
                return res.status(SUCCESS_OK).json(newPost)
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
    let postImages = req.files
    let image = null
    let imageId = null
    let newData = null

    if (postImages?.length > 0) {
        image = []
        imageId = []
        await Promise.all(postImages.map(async (file) => {
            const cloud = await cloudinary.uploader.upload(file.path, { folder: userId })
            image.push(cloud.url)
            imageId.push(cloud.public_id)
            fs.unlinkSync(file.path)
        }))
        // save
        newData = {
            content: postContent,
            image: image,
            imageId: imageId,
            video: linkVideo
        }
    }else {
        newData = {
            content: postContent,
            video: linkVideo
        }
    }
    PostModel.findOneAndUpdate({ _id: postID, createdBy: userId }, newData, { new: true })
        .then((post) => {
            if (!post)
                return res.status(BAD_REQUEST).json({ message: POST_NOT_FOUND })

            return res.status(SUCCESS_OK).json(post)
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
        .then(data => {
            if (!data)
                return res.status(BAD_REQUEST).json({ message: POST_NOT_FOUND })

            // delete img in cloud
            cloudinary.uploader.destroy(data.imageId[0])

            // delete share post
            PostModel.deleteMany({ rootPost: postID })
                .then((dataShare) => {

                    // delete comment
                    CommentModel.deleteMany({ postID: postID })
                        .then(dataCmt => {
                            return res.status(SUCCESS_OK).json({ message: 'Xóa thành công!', data: data, dataShare: dataShare, dataCmt: dataCmt })
                        })


                })
        })
        .catch(e => {
            return res.status(BAD_REQUEST).json({ message: e.message })
        })
}