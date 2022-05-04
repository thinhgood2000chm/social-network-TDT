const post = require('../../models/post')
const account = require('../../models/user')
const {BAD_REQUEST, USER_NOT_FOUND, POST_NOT_FOUND, CASTERROR, NOT_THING_CHANGE, SUCCESS_OK} = require('../../library/constant')

exports.likePost = (req,res)=>{
    var {postId} = req.params
    var userIdLike = req.userId
    account.findById(userIdLike)
    .then(()=>{
        post.findByIdAndUpdate(postId, {$push:{like:userIdLike}}, {new: true})
        .then((postInfo)=>{
            console.log(postInfo)
            res.json({"length":postInfo.like.length})
        })
        .catch(err=>{
            console.log("da vao")
            res.send(err.name)
        })
    })
    .catch(err=>{
        if(err.name == CASTERROR){
             return res.status(BAD_REQUEST).json({"description": POST_NOT_FOUND})

        }
    })
    post.findByIdAndUpdate()

}