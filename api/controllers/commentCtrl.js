const {BAD_REQUEST, USER_NOT_FOUND, POST_NOT_FOUND, CASTERROR, NOT_THING_CHANGE} = require('../../library/constant')
const post = require('../../models/post')
const account = require('../../models/user')


exports.createComment = (req,res)=>{
    var {postId} = req.params
    var {userIdComment, content} = req.body
    
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
            return res.json(postInfo.comment[postInfo.comment.length-1])
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