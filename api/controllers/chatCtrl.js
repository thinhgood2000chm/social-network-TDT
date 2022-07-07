const { BAD_REQUEST, LIMIT_PAGING, POST_NOT_FOUND, CASTERROR, NOT_THING_CHANGE, SUCCESS_OK } = require('../../library/constant')
const conversation = require('../../models/conversation')
const account = require('../../models/user')
const notification = require('../../models/notification')
const comment = require('../../models/comment')
const userOnline = require('../../models/userOnline')

const app = require('../../index')

exports.createConversation = (req, res) => {
    var { receiverId } = req.body
    account.find({ _id: { $in: [receiverId, req.userId] } })
    .then(data => {
        if (data.length === 2) {
            conversation.findOne({members: { $in: [receiverId,  req.userId] }}).populate("members")
            .then(existConversation=>{
                if (!existConversation){
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