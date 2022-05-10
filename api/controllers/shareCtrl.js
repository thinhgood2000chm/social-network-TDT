const post = require('../../models/post')
const {BAD_REQUEST, USER_NOT_FOUND, EXIST_SHARE_POST, CASTERROR, SUCCESS_OK} = require('../../library/constant')
const account = require('../../models/user')
const notification = require('../../models/notification')

exports.createShare = (req,res)=>{
    var{postId} = req.params
    var userId = req.userId // id của user share bài 

    post.findById(postId) // check xem id post có tồn tại hay không
    .then((postInfo)=>{
        // không sử dụng element match thì sẽ ra như bình thường 
        post.find({rootPost:postId, userId:userId}) // check nếu user hiện tại đã chia sẻ bài viết rồi thì ko cho chia sẻ nữa
      
        // {
        //     post:{
        //         "$elemMatch":{
        //             "rootPostId": postInfo._id  
        //         }
        //     }
        // },

        // khi sử dụng elementmatch
        //[
        //{ _id: new ObjectId("626aae92a03d2fa0af79460a"), post: [ [Object] ] }
        //]
         .then((isSharePost)=>{
            if (isSharePost.length != EXIST_SHARE_POST){
 
                return res.status(SUCCESS_OK).json({"description":"Bạn đã chia sẻ bài viết này"})
            }
            else{     
                const sharePost = new post({
                    createdBy: userId,
                    content: postInfo.content,
                    image: postInfo.image,
                    video: postInfo.video,
                    rootPost: postInfo._id
        
                })
                sharePost.save()
                .then((data)=>{
                    // account.findByIdAndUpdate(userId, {$push:{post:{rootPostId: postInfo._id, sharePostId:data._id}}},  {new: true}) //account của người share bài
                    account.findById(userId)
                    .then((accountUserShare)=>{
                        newNotification = new notification(
                            {
                                userId:postInfo.userId,
                                userIdGuest: userId,
                                content: `${accountUserShare.fullname} đã chia sẻ bài viết của bạn`
                            }
            
                        )
                        newNotification.save()
                        .then(()=>{
                            // account.findByIdAndUpdate(postInfo.userId, {$push:{notification:newNotification._id}}, {new: true})
                            // .then(()=>{
                            //     return res.json({"description": "Bài viết đã được chia sẻ trên trang cá nhân của bạn"})
                            // })  
                            return res.json({"description": "Bài viết đã được chia sẻ trên trang cá nhân của bạn"})   
                        })
                       
                    })
                
                })
               
                .catch((err)=>{
                    return res.send(err.name)
                })  
            }
    
        })

    })
    .catch(err=>{
        return res.send(err.name)
    })
}