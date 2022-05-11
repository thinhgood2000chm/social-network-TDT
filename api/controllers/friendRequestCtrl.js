const { USER_NOT_FOUND, SUCCESS_OK, CASTERROR, FRIEND_REQUEST_NOT_FOUND } = require('../../library/constant')
const friendRequest = require('../../models/friendRequest')
const account = require('../../models/user')

exports.createRequestNewFriend = (req,res)=>{
    var userId = req.userId
    var {idUserWantsendRequest}=req.params // id của user mà người đang đăng nhập vào muôn sguiwr lời mời kết bạn

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
    var {idUserInQueueRequest} = req.params
    console.log("aaaaaaaaaaaaa", idUserInQueueRequest)
    friendRequest.findOneAndUpdate({userReceiveId:userId, userRequest: idUserInQueueRequest, status: false}, {status:true})
    .then((friendReqInfo)=>{
        console.log("da vao ",friendReqInfo)
        if(friendReqInfo){
            // cập nhật lại thông tin bạn bè trong list friend của từng người
            console.log("asdfasdf", friendReqInfo.userRequest.toString())
            account.find({_id:{$in:[idUserInQueueRequest, userId]}})
            .then((hah)=>{
                console.log("hahah", hah)
                return res.status(SUCCESS_OK).json({
                    "description":"2 người đã trở thành bạn"
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