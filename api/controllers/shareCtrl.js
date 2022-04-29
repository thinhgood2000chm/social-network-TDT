const post = require('../../models/post')
const {BAD_REQUEST, USER_NOT_FOUND, POST_NOT_FOUND, CASTERROR, NOT_THING_CHANGE, SUCCESS_OK} = require('../../library/constant')
const account = require('../../models/user')

exports.createShare = (req,res)=>{
    var{postId} = req.params
    post.findById(postId)
    .then((postInfo)=>{
        const sharePost = new post({
            userId: req.userId,
            content: postInfo.content,
            image: postInfo.image,
            video: postInfo.video,
            rootPost: postInfo._id

        })
        sharePost.save()
        .then((data)=>{
            // làm tiếp cập nhật bài viết cho user 
            account.findByIdAndUpdate({})
        })
        .catch((err)=>{
            return err
        })
    })
    .catch(err=>{
        return err
    })
}