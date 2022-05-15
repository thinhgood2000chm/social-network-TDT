const req = require("express/lib/request")
const notification = require("../../models/notification")
const {BAD_REQUEST, NOTIFICATION_NOT_FOUND, CASTERROR,LIMIT_PAGING} = require('../../library/constant')


exports.getAllNoti = (req, res) => {
    var {start} = req.query
    console.log(start)
    skip = Number(start)*LIMIT_PAGING

    notification.find({ userId: req.userId, deletedFlag: false }).sort({ createdAt: -1, }).skip(skip).limit(10)
        .then((listNoti) => {
            return res.json(listNoti)
        })
}

exports.deleteNoti = (req, res)=>{
    var {notificationId} = req.params

    // delete chỗ này được gọi là sorf delete, ko xóa hẳn khỏi data base nhưng sẽ xóa không cho người dùng nhìn thấy được thông qua biên deletedFlag
    // ko xóa hoàn toàn đi o mà chỉ ẩn thông báo đó khỏi người dùng nếu người dùng yêu cầu 
    notification.findOneAndUpdate({userId:req.userId, _id: notificationId}, {deletedFlag: true})
    .then(()=>{
        return res.json({"description": "thông báo đã được ẩn đi"})
    })
    .catch(err=>{
        if(err.name == CASTERROR){
            return res.status(BAD_REQUEST).json({"description": NOTIFICATION_NOT_FOUND})

       }
       else{
           return res.send(err.name)
       }
    })
}