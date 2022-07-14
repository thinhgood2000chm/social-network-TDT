const { BAD_REQUEST, LIMIT_MESSAGE, POST_NOT_FOUND, CASTERROR, NOT_THING_CHANGE, SUCCESS_OK } = require('../../library/constant')
const conversation = require('../../models/conversation')
const account = require('../../models/user')
const message = require('../../models/message')
const comment = require('../../models/comment')
const userOnline = require('../../models/userOnline')

const app = require('../../index')

exports.createConversation = (req, res) => {
    var { receiverId } = req.body
    account.find({ _id: { $in: [receiverId, req.userId] } })
    .then(data => {
        if (data.length === 2) {
            conversation.findOne({members: { $all: [receiverId,  req.userId] }}).populate("members")
            .then(isExistConversation=>{
                if (!isExistConversation){
                    var newConversation = new conversation({
                        members: [receiverId, req.userId]
                    })
                    newConversation.save()
                    .then(newConversation=>{
                        newConversation.populate("members")
                        .then(newConversation=>{
                            return res.json(newConversation)
                        })
        
                    })
                }
                else{
                    return res.json(isExistConversation)
                    // return res.json({ "description": 'đã tồn tại cuộc trò chuyện ' })
                }
            })
        
        }
        else {
            return res.json({ "description": `${receiverId}, ${req.userId} có user không tồn tại` })
        }
    })
    .catch((e) => {

        return res.status(BAD_REQUEST).json({ message: e.message })

    })

}


exports.getAllConversationOfCurrentUser = async(req,res)=>{
    var userId = req.userId
    conversation.find({members: { $in: [userId] }}).populate('members')
    .then(conversations=>{
        console.log("conversations", conversations)
        const menberIdOnline = []
        for(var i = 0; i< conversations.length; i ++){
            for(var j = 0; j< conversations[i].members.length; j++){
                userOnlineId =conversations[i].members[j]._id 
                if(!menberIdOnline.includes(userOnlineId) && userOnlineId.toString()!==userId.toString()){
                    menberIdOnline.push(userOnlineId.toString())
                } 
            }

            if( i === conversations.length -1){
                console.log(menberIdOnline)
                userOnline.find({userId:{$in:menberIdOnline}}).distinct("userId")
                .then(userOnlines=>{
                    console.log("fffffffff", userOnlines)
                    for(var l =0 ;l<conversations.length;l++){
                        conversations[l] =  conversations[l].toJSON()
                        for(var k = 0; k< conversations[l].members.length; k++){
                            // conversations[l].members[k] =  conversations[l].members[k].toJSON()
        
                            if(userOnlines.includes(conversations[l].members[k]._id.toString() )){
                   
                                conversations[l].members[k].isOnline = true

                            }
                            else{
                                conversations[l].members[k].isOnline = false
                            }
                        }
                        if(l===conversations.length-1){
                            return res.json(conversations)
                        }
                    }
              
                })
                .catch(e=>{
                    return res.status(BAD_REQUEST).json({ message: e.message }) 
                })
            }
       
        }



    })
    .catch(e=>{
        return res.status(BAD_REQUEST).json({ message: e.message })
    })
}

exports.getConversationOfCurrentUser = (req,res)=>{
    var currentUserId = req.userId
    var  {receiverId} = req.params
    conversation.findOne({ members: { $all: [currentUserId, receiverId] }})
    .then(conversation=>{

        return res.json(conversation)
    })
    .catch(e=>{
        return res.status(BAD_REQUEST).json({ message: e.message })
    })
}


exports.createMessage = (req,res) =>{
    var {mess, conversationId} = req.body
    conversation.findById(conversationId)
    .then(conversationInfo=>{
        var newMess = new message({
            conversationId: conversationId,
            senderId: req.userId,
            text: mess
        })
        newMess.save()
        
        .then((newMess)=>{
            // trả dữ liệu realtime chỗ này 
            newMess.populate("conversationId")
            .then(newMess=>{
                newMess.populate("senderId")
                .then((newMess)=>{
                    otherUserInChat = newMess.conversationId.members.filter(item=>item.toString() !==newMess.senderId._id.toString() )
                    if(otherUserInChat.length === 1){
                        userOnline.findOne({userId: otherUserInChat[0], status:true})
                        .then(dataUserId=>{
                            // nếu ko tìm thấy đồng nghĩa user đó đã off
                            if(dataUserId){
                                console.log(dataUserId)
                                app.IoObject.to(dataUserId.socketId).emit("receiveNewMess",newMess)
                            }
                            
                        })     
                        .catch(e=>{
                            return res.status(BAD_REQUEST).json({ message: e.message }) 
                        })
    
                    }
                    return res.json(newMess)
                })

            })    
            .catch(e=>{
                return res.status(BAD_REQUEST).json({ message: e.message }) 
            })

        })        
        .catch(e=>{
            return res.status(BAD_REQUEST).json({ message: e.message }) 
        })

    })
    .catch(e=>{
        return res.status(BAD_REQUEST).json({ message: e.message }) 
    })

}

// danh sachs các message của 1 conversation
exports.getMessage = (req,res)=>{
    var {conversationId} = req.params
    var {skip} = req.query
     message.find({conversationId:conversationId}).sort({ createdAt: -1 }).skip(skip).limit(LIMIT_MESSAGE).populate('senderId').populate("conversationId")
     .then(conversationData=>{
        // console.log(conversationData)
        return res.json(conversationData)
     })
     .catch(e=>{
        return res.status(BAD_REQUEST).json({ message: e.message }) 
     })
}

// guwir tin nhắn cho từng cá nhân dựa trên socket id 
// thông báo tin nhắn mới sẽ giống nhưu thông bào noti sẽ dựa trên userOnline