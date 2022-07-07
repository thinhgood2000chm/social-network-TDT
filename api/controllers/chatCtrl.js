const { BAD_REQUEST, LIMIT_PAGING, POST_NOT_FOUND, CASTERROR, NOT_THING_CHANGE, SUCCESS_OK } = require('../../library/constant')
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
                    return res.json(existConversation)
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


exports.getAllConversationOfCurrentUser = (req,res)=>{
    var userId = req.userId
    conversation.find({members: { $in: [userId] }}).populate('members')
    .then(conversations=>{
        return res.json(conversations)
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
            newMess.populate("senderId")
            .then(newMess=>{
                return res.json(newMess)
            })

        })
    })
    .catch(e=>{
        return res.status(BAD_REQUEST).json({ message: e.message }) 
    })

}


// khi bấm vào icon chat thì sẽ load ra các conversation => từ đây tạo join các user vào phòng ( số lượng phòng dựa trên số tin nhắn ) 
// thông báo tin nhắn mới sẽ giống nhưu thông bào noti sẽ dựa trên userOnline