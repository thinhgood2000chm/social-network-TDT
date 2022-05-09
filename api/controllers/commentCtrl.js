const {BAD_REQUEST, USER_NOT_FOUND, POST_NOT_FOUND, CASTERROR, NOT_THING_CHANGE, SUCCESS_OK} = require('../../library/constant')
const post = require('../../models/post')
const account = require('../../models/user')
const notification = require('../../models/notification')
const router = require('../routers/commentRoute')


exports.createComment = (req,res)=>{
    var {postId} = req.params
    var {content} = req.body
    var userIdComment = req.userId
    account.findById(userIdComment)
    .then((userinfo)=>{
        dataUpdate = {
            userIdComment:userIdComment, 
            imageUserComment: userinfo.picture, 
            nameUserComment:userinfo.fullname, 
            content:content
        }
        post.findByIdAndUpdate(postId,{$push:{comment: dataUpdate}}, {new:true})
        .then((postInfo)=>{
            if (userIdComment !== postInfo.userId){

                newNotification = new notification(
                    {
                        userId: postInfo.userId,
                        userIdGuest: userIdComment,
                        content: `${userinfo.fullname} đã bình luận bài viết của bạn`
                    }
    
                )
                newNotification.save()
                .then(
                    (newNoti)=>{
                        return res.json(postInfo.comment[postInfo.comment.length-1])
                        // cập nhật lại dữ liệu thông báo cho user của bài viết để user này nhận được thông báo
                        // account.findByIdAndUpdate(postInfo.userId,  {$push:{notification:newNoti._id}})
                        // .then(()=>{
                        //     return res.json(postInfo.comment[postInfo.comment.length-1])
                        // })
                        // .catch(err=>{
                        //     return res.send(err.name)
                        // })
                    }
                )
            }
            else{
                return res.json(postInfo.comment[postInfo.comment.length-1])
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