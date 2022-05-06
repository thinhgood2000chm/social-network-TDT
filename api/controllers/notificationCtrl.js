const notification = require("../../models/notification")



exports.getAllNoti = (req,res)=>{
    notification.find({userId: req.userId}).sort({createdAt:-1,}).limit(10)
    .then((listNoti)=>{
        return res.json(listNoti)
    })
}