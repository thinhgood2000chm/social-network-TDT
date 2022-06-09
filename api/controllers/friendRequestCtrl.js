const { USER_NOT_FOUND, SUCCESS_OK, CASTERROR, FRIEND_REQUEST_NOT_FOUND, LIMIT_PAGING, BAD_REQUEST} = require('../../library/constant')
const { mapReduce } = require('../../models/friendRequest')
const friendRequest = require('../../models/friendRequest')
const account = require('../../models/user')

exports.createRequestNewFriend = (req,res)=>{
    var userId = req.userId
    var {idUserWantsendRequest}=req.params // id của user mà người đang đăng nhập hiện tại muôn guiwr lời mời kết bạn

    account.findById(idUserWantsendRequest)
    .then((userWantRequestInfo)=>{
        account.findById(userId)
        .then((userSendrequest)=>{
            console.log(userWantRequestInfo.friends)
            if(userWantRequestInfo.friends.includes(userId)){
                return res.json({"error":"Đã kết bạn đến người này rồi "})
            }
            else{
                friendRequest.findOne({userId: userId})
                .then((isSendRequest)=>{
                    if(isSendRequest){
                        return res.json({'description':'Request đã được gửi đến user này'})
                    }
                    else{
                    let newFriendRequest = new friendRequest({
                        userReceiveId: idUserWantsendRequest,
                        userRequest: userId
                    })
                    newFriendRequest.save()
                    .then(newFriendRequest=>{
                        return res.json({'description':'gửi yêu cầu thành công'})
                    })
                    }
       
                })
              
            }

   
        })
    })
    .catch(err=>{
        if(err.name == CASTERROR){
            return res.status(BAD_REQUEST).json({"description": USER_NOT_FOUND})
       }
       else{
           return res.send(err.name)
       }
    })
}


exports.acceptOrDelete = (req,res)=>{
    userId = req.userId
    var {idUserInQueueforAccept} = req.params
    console.log(userId, idUserInQueueforAccept)
    friendRequest.findOneAndUpdate({userReceiveId:userId, userRequest: idUserInQueueforAccept, status: false}, {status: true})
    .then((friendReqInfo)=>{
        console.log("da vao ",friendReqInfo)
        if(friendReqInfo){
            // cập nhật lại thông tin bạn bè của người được gửi lời mời kết bạn
            account.findByIdAndUpdate(userId,{$push:{friends:idUserInQueueforAccept}}, {new:true})
            .then(()=>{
                // cập nhật bạn bè cho người mà gửi lời mời kết bạn 
                account.findByIdAndUpdate(idUserInQueueforAccept,{$push:{friends:userId}}, {new:true})
                .then(()=>{
                    return res.status(SUCCESS_OK).json({
                        "description":"2 người đã trở thành bạn"
                    })
                })
            
            })
            
        }
        else{
            return res.json({"error":"không tìm thấy yêu cầu kết bạn"})
        }

 
    })
    .catch(err=>{
        if(err.name == CASTERROR){
            return res.status(BAD_REQUEST).json({"description": FRIEND_REQUEST_NOT_FOUND})
       }
       else{
           return res.send(err.name)
       }
    })
}


exports.listAll = (req,res)=>{
    var {userId} = req.params
    var {start} = req.query

    skip = Number(start)*LIMIT_PAGING
    account.findById(userId).lean().populate({
        path:"friends",
        options:{
            limit:10,
            sort:{createdAt:-1},
            skip: skip
        },
        select:{"_id":1, "picture":1, "fullname":1}
    })
    .then(userInfo=>{
        console.log(userInfo)
        return res.json(userInfo.friends)
    })
    .catch((err)=>{
        if(err.name == CASTERROR){
            return res.status(BAD_REQUEST).json({"description": USER_NOT_FOUND})

       }
       else{
           return res.send(err.name)
       }
    })

}