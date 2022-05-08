const post = require('../../models/post')
const account = require('../../models/user')
const {BAD_REQUEST, POST_NOT_FOUND, CASTERROR} = require('../../library/constant')
const notification = require('../../models/notification')
exports.likePost = (req,res)=>{
    var {postId} = req.params
    var userIdLike = req.userId

    account.findById(userIdLike)
    .then((userLikeInfo)=>{
        
        post.findOne({_id:postId, like: userIdLike})
        .then((data)=>{
            if(data == null){
                post.findByIdAndUpdate(postId, {$push:{like:userIdLike}}, {new: true})
                .then((postInfo)=>{
                    // nếu người like ko phải người tạo ra bài viết 
                    if(userIdLike !==postInfo.userId){
                        newNotification = new notification(
                            {
                                userId:postInfo.userId, // người tạo bài viết ( thể hiện cái noti này là của user nào )
                                userIdGuest: userIdLike,
                                content: `${userLikeInfo.fullname} đã thích bài viết của bạn`
                            }
            
                        )
                        newNotification.save()
                        .then(
                            (newNotification)=>{
                                // // cập nhật lại cho user của bài viết chuỗi id của thông báo vừa tạo
                                // account.findByIdAndUpdate(postInfo.userId, {$push:{notification:newNotification._id}})
                                // .then(()=>{
                                //    return  res.json({"length":postInfo.like.length})
                                // })
                                // .catch(err=>{
                                //     return res.send(err.name)
                                // })
                                return  res.json({"status":"like", "length":postInfo.like.length})
                            }
                          
                        )
                        .catch(err=>{
                                return res.send(err.name)
                            })
                    }
                    else {
                        // nếu người like là người tạo ra bài viết 
                        return  res.json({"status":"like", "length":postInfo.like.length})
                    }
        
        
                })
                .catch(err=>{
                    res.send(err.name)
                })
            }
            else{
                post.findByIdAndUpdate(postId, {$pull:{like:userIdLike}}, {new: true})
                .then((postInfo)=>{
                    return  res.json({"status":"unlike", "length":postInfo.like.length})
                })  
                .catch(err=>{
                    res.send(err.name)
                })         
             }
       
        })
    })
        
        // TODO đang thiếu phần nếu bấm 1 lần nữa thì sẽ ko like bài viết nữa
      
    .catch(err=>{
        if(err.name == CASTERROR){
             return res.status(BAD_REQUEST).json({"description": POST_NOT_FOUND})

        }
    })


}