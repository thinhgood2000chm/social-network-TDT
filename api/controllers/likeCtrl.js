const post = require('../../models/post')
const account = require('../../models/user')
const userOnline = require('../../models/userOnline')
const {BAD_REQUEST, POST_NOT_FOUND, CASTERROR} = require('../../library/constant')
const notification = require('../../models/notification')
const app = require('../../index')

exports.likePost = (req,res)=>{
    var {postId} = req.params
    var userIdLike = req.userId
    console.log("da vao ")
    account.findById(userIdLike)
    .then((userLikeInfo)=>{
        
        post.findOne({_id:postId, likedBy: userIdLike})
        .then((data)=>{
            if(data == null){
                post.findByIdAndUpdate(postId, {$push:{likedBy:userIdLike}}, {new: true})
                .then((postInfo)=>{
                    console.log(postInfo)
                    // nếu người like ko phải người tạo ra bài viết 
                    if(userIdLike !==postInfo.createdBy.toString()){
                        console.log(" da vao 123123")
                        newNotification = new notification(
                            {
                                userId: postInfo.createdBy, // người tạo bài viết ( thể hiện cái noti này là của user nào )
                                userIdGuest: userIdLike,
                                content: `${userLikeInfo.fullname} đã thích bài viết của bạn`
                            }
            
                        )
                        newNotification.save()
                        .then(
                            (newNotification)=>{
                                userOnline.findOne({userId: postInfo.createdBy.toString()})
                                .then(dataUserOnline=>{
                                    // nếu ko tìm thấy đồng nghĩa user đó đã off
                                    if(dataUserOnline && dataUserOnline.userId !== req.userId){
                                        app.IoObject.to(dataUserOnline.socketId).emit("receiveMessageLike",`${userLikeInfo.fullname} đã thích bài viết của bạn`)
                                    }
                                    
                                 
                                })
                                .catch(e=>{
                                    console.log(e.message)
                                })
                                // // cập nhật lại cho user của bài viết chuỗi id của thông báo vừa tạo
                                // account.findByIdAndUpdate(postInfo.userId, {$push:{notification:newNotification._id}})
                                // .then(()=>{
                                //    return  res.json({"length":postInfo.like.length})
                                // })
                                // .catch(err=>{
                                //     return res.send(err.name)
                                // })
                                return  res.json({"status":true, "length":postInfo.likedBy.length})
                            }
                          
                        )
                        .catch(err=>{
                                return res.send(err.name)
                            })
                    }
                    else {
                        // nếu người like là người tạo ra bài viết 
                        return  res.json({"status":true, "length":postInfo.likedBy.length})
                    }
        
        
                })
                .catch(err=>{
                    res.send(err.name)
                })
            }
            else{
                post.findByIdAndUpdate(postId, {$pull:{likedBy:userIdLike}}, {new: true})
                .then((postInfo)=>{
                    console.log(postInfo)
                    return  res.json({"status":false, "length":postInfo.likedBy.length})
                })  
                .catch(err=>{
                    res.send(err.name)
                })         
             }
       
        })
            
        .catch(err=>{
                return res.status(BAD_REQUEST).json({"message": err.message})
            
        })
    })
        
        // TODO đang thiếu phần nếu bấm 1 lần nữa thì sẽ ko like bài viết nữa
      
    .catch(err=>{
        if(err.name == CASTERROR){
             return res.status(BAD_REQUEST).json({"description": POST_NOT_FOUND})

        }
    })


}