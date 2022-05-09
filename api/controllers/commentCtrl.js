const {BAD_REQUEST, LIMIT_PAGING, POST_NOT_FOUND, CASTERROR, NOT_THING_CHANGE, SUCCESS_OK} = require('../../library/constant')
const post = require('../../models/post')
const account = require('../../models/user')
const notification = require('../../models/notification')
const comment = require('../../models/comment')
const router = require('../routers/commentRoute')
const { create } = require('../../models/post')


exports.createComment = (req,res)=>{
    var {postId} = req.params
    var {content} = req.body
    var userIdComment = req.userId
    post.findById(postId)
    .then((postInfo)=>{
        let newComment = new comment({
            postId: postId,
            userIdComment: userIdComment,
            content: content
        })
        newComment.save()
        .then(()=>{
            if (userIdComment !== postInfo.userId){
                account.findById(userIdComment).then((userinfo)=>{
                    newNotification = new notification(
                    {
                        userId: postInfo.userId,
                        userIdGuest: userIdComment,
                        content: `${userinfo.fullname} đã bình luận bài viết của bạn`
                    })
                    newNotification.save()
                    .then(
                        (newNoti)=>{
                            console.log(newNoti)
                            return res.json(newComment)
                    })
              
                        // cập nhật lại dữ liệu thông báo cho user của bài viết để user này nhận được thông báo
                        // account.findByIdAndUpdate(postInfo.userId,  {$push:{notification:newNoti._id}})
                        // .then(()=>{
                        //     return res.json(postInfo.comment[postInfo.comment.length-1])
                        // })
                        // .catch(err=>{
                        //     return res.send(err.name)
                        // })
                })
            }
            else{
                return res.json(newComment)
            }


        })
        .catch(error=>{
            if(error.name ==CASTERROR)
                return res.status(BAD_REQUEST).json({"description": POST_NOT_FOUND})
            return res.status(BAD_REQUEST).json({
                "error":error.name
            })
        })
    })
    .catch(error=>{
        return res.status(BAD_REQUEST).json({
            "description": error.name
        })
    })
  
}

exports.deleteComment = (req,res)=>{
    var{postId, commentId} = req.params
    post.find({_id:postId, 'comment._id': commentId}, {comment:{
        "$elemMatch":{
            "_id": commentId
        }
    }})
    .then((postInfo)=>{
        // kiểm tra xem đây có phải comment của người đang thực hiện thao tác xóa hay không 
        commentInfo = postInfo[0].comment[0]
        if(req.userId === commentInfo.userIdComment){
            post.findByIdAndUpdate(postId, {$pull:{comment:{_id:commentId}}}).then(()=>{
                return res.sendStatus(SUCCESS_OK)
            })
        }
        // phải dùng else, ko dùng giống python thì sẽ dính lỗi bất đồng bộ
        else{
            return res.json({
                "description":"user hiện tại không có quyền xóa comment của user khác "
            })
        }

    })
    .catch(err=>{
        if(err.name ==CASTERROR)
            return res.status(BAD_REQUEST).json({"description": POST_NOT_FOUND})
        return res.status(BAD_REQUEST).json({
            "error":err.name
        })
    })
}


exports.listComment = (req,res)=>{
    var {postId} = req.params
    var {start} = req.query
    console.log(start)
    skip = Number(start)*LIMIT_PAGING
    post.findById(postId)
    .then(
        (postInfo)=>{
            comment.find({postId:postId}).sort({ createdAt: 1 }).skip(skip).limit(LIMIT_PAGING)
            .then(commentsInfo=>{
                return res.json(commentsInfo)
            })

    })
    .catch(err=>{
        if(err.name == CASTERROR){
            return res.status(BAD_REQUEST).json({"description": POST_NOT_FOUND})
        }
        else{
            return res.send(err.name)
        }
    })
    
}