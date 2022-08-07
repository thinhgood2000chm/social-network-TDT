const { BAD_REQUEST, LIMIT_MESSAGE, POST_NOT_FOUND, CASTERROR, NOT_THING_CHANGE, SUCCESS_OK } = require('../../library/constant')
const mongoose = require('mongoose');
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
                conversation.findOne({ members: { $all: [receiverId, req.userId] } }).populate('members')
                    .then(isExistConversation => {
                        if (!isExistConversation) {
                            var newConversation = new conversation({
                                members: [receiverId, req.userId]
                            })
                            newConversation.save()
                                .then(newConversation => {
                                    newConversation.populate('members')
                                        .then(newConversation => {
                                            return res.json(newConversation)
                                        })

                                })
                        }
                        else {
                            return res.json(isExistConversation)
                            // return res.json({ 'description': 'đã tồn tại cuộc trò chuyện ' })
                        }
                    })

            }
            else {
                return res.json({ 'description': `${receiverId}, ${req.userId} có user không tồn tại` })
            }
        })
        .catch((e) => {

            return res.status(BAD_REQUEST).json({ message: e.message })

        })

}


exports.getAllConversationOfCurrentUser = (req, res) => {
    var userId = req.userId
    conversation.find({ members: { $in: [userId] } }).populate('members')
        .then(conversations => {
            if(conversations.length < 1 ){
                return res.json([])
            }
            // get list id
            const listId = conversations.map(i => i._id.toString())
            // get all msg from other sort by time and 
            message.find({ conversationId: { $in: listId }, senderId: { $ne: userId } })
                .populate('senderId').populate('conversationId')
                .then((msgFromOther) => {
                    let listIdHaveMsg = []; // sử dụng để thêm vào những conversation chưa có tin nhắn
                    // get lasted message => remove duplicate object in arr
                    let dataArr = msgFromOther.map(item => {
                        listIdHaveMsg.push(item.conversationId._id.toString());

                        // tạo 2D array gồm key là filed chỉ muốn lấy phần tử đầu tiên và values
                        return [JSON.stringify(item.conversationId), item];
                    });
                    // Map() sẽ tự xóa những phần tử có key bị trùng -> {key1 => values1, key2 => values2, ...}
                    let mapArr = new Map(dataArr); // create key value pair from array of array
                    const lastMsgFromOther = [...mapArr.values()]

                    // bổ sung conversation chưa có msg 
                    const idNoMsg = listId.filter(i => !listIdHaveMsg.includes(i));
                    const conversationsNoMsg = conversations.filter(i => idNoMsg.includes(i._id.toString()));
                    conversationsNoMsg.map(i => {
                        const senderId = i.members.find(m => m._id !== userId);
                        tmpMsg = {
                            _id: mongoose.Types.ObjectId(),
                            conversationId: i,
                            senderId: senderId,
                            text: '...'
                        }
                        lastMsgFromOther.push(tmpMsg)
                    })

                    const menberIdOnline = []
                    for (var i = 0; i < lastMsgFromOther.length; i++) {
                        if (!menberIdOnline.includes(lastMsgFromOther[i].senderId)) {
                            menberIdOnline.push(lastMsgFromOther[i].senderId._id.toString())
                            // } 
                        }

                        if (i === lastMsgFromOther.length - 1) {
                            userOnline.find({ userId: { $in: menberIdOnline }, status: true }).distinct("userId")
                                .then(userOnlines => {
                                    for (var l = 0; l < lastMsgFromOther.length; l++) {
                                        if (lastMsgFromOther[l].senderId) {
                                            if(lastMsgFromOther[l].text !== '...'){
                                                lastMsgFromOther[l] = lastMsgFromOther[l].toJSON()
                                            }
                                            else{
                                                lastMsgFromOther[l].senderId = lastMsgFromOther[l].senderId.toJSON()
                                            }
                                            if (userOnlines.includes(lastMsgFromOther[l].senderId._id.toString())) {
                                                lastMsgFromOther[l].senderId.isOnline = true
                                            }
                                            else {
                                                lastMsgFromOther[l].senderId.isOnline = false
                                            }

                                        }
                                        if (l === lastMsgFromOther.length - 1) {
                                            return res.json(lastMsgFromOther)
                                        }
                                    }
                                })
                                .catch(e => {
                                    return res.status(BAD_REQUEST).json({ message: e.message })
                                })
                        }
                    }


                })
        })
        .catch(e => {
            return res.status(BAD_REQUEST).json({ message: e.message })
        })
}

exports.getConversationOfCurrentUser = (req, res) => {
    var currentUserId = req.userId
    var { receiverId } = req.params
    conversation.findOne({ members: { $all: [currentUserId, receiverId] } })
        .then(conversation => {
            if(conversation.length<1)
                return res.json([])
            return res.json(conversation)
        })
        .catch(e => {
            return res.status(BAD_REQUEST).json({ message: e.message })
        })
}


exports.createMessage = (req, res) => {
    var { mess, conversationId } = req.body
    conversation.findById(conversationId)
        .then(conversationInfo => {
            var newMess = new message({
                conversationId: conversationId,
                senderId: req.userId,
                text: mess
            })
            newMess.save()

                .then((newMess) => {
                    // trả dữ liệu realtime chỗ này 
                    newMess.populate('conversationId')
                        .then(newMess => {
                            newMess.populate('senderId')
                                .then((newMess) => {
                                    otherUserInChat = newMess.conversationId.members.filter(item => item.toString() !== newMess.senderId._id.toString())

                                    if (otherUserInChat.length === 1) {
                                        userOnline.findOne({ userId: otherUserInChat[0] })
                                            .then(dataUserId => {
                                                // nếu ko tìm thấy đồng nghĩa user đó đã off
                                                if (dataUserId) {
                                                    // app.IoObject.to(dataUserId.socketId).emit('receiveNewMess', newMess)
                                                    app.IoObject.in(newMess.conversationId._id.toString()).emit('receiveNewMess', newMess)

                                                }

                                            })
                                            .catch(e => {
                                                return res.status(BAD_REQUEST).json({ message: e.message })
                                            })

                                    }
                                    return res.json(newMess)
                                })

                        })
                        .catch(e => {
                            return res.status(BAD_REQUEST).json({ message: e.message })
                        })

                })
                .catch(e => {
                    return res.status(BAD_REQUEST).json({ message: e.message })
                })

        })
        .catch(e => {
            return res.status(BAD_REQUEST).json({ message: e.message })
        })

}

// danh sachs các message của 1 conversation
exports.getMessage = (req, res) => {
    var { conversationId } = req.params
    var { skip } = req.query
    message.find({ conversationId: conversationId }).sort({ createdAt: -1 }).skip(skip).limit(LIMIT_MESSAGE).populate('senderId').populate('conversationId')
        .then(conversationData => {
            // console.log(conversationData)
            return res.json(conversationData)
        })
        .catch(e => {
            return res.status(BAD_REQUEST).json({ message: e.message })
        })
}

// guwir tin nhắn cho từng cá nhân dựa trên socket id
// thông báo tin nhắn mới sẽ giống nhưu thông bào noti sẽ dựa trên userOnline