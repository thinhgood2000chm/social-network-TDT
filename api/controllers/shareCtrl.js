const post = require('../../models/post')
const {BAD_REQUEST, USER_NOT_FOUND, EXIST_SHARE_POST, CASTERROR, SUCCESS_OK} = require('../../library/constant')
const account = require('../../models/user')

exports.createShare = (req,res)=>{
    var{postId} = req.params
    var userId = req.userId

    post.findById(postId) // check xem id post có tồn tại hay không
    .then((postInfo)=>{
        account.find({_id:userId,"post.rootPostId": postInfo._id }, // check nếu user hiện tại đã chia sẻ bài viết rồi thì ko cho chia sẻ nữa
        {
            post:{
                "$elemMatch":{
                    "rootPostId": postInfo._id
                }
            }
        }, (err, result)=>{
            if (result.length != EXIST_SHARE_POST){
                console.log(result)
                return res.status(SUCCESS_OK).json({"description":"Bạn đã chia sẻ bài viết này"})
            }
            else{        
                const sharePost = new post({
                    userId: userId,
                    content: postInfo.content,
                    image: postInfo.image,
                    video: postInfo.video,
                    rootPost: postInfo._id
        
                })
                sharePost.save()
                .then((data)=>{
                    account.findByIdAndUpdate(userId, {$push:{post:{rootPostId: postInfo._id, sharePostId:data._id}}},  {new: true})
                    .then((accountUpdate)=>{
                        res.json({"description": "Bài viết đã được chia sẻ trên trang cá nhân của bạn"})
                    })
                })
                     
                .catch((err)=>{
                    return err.name
                })
            }
    
        })

    })
    .catch(err=>{
        return err.name
    })
}