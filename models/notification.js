const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const notificationSchema = new Schema({
    userId:{ // id của người nhận được thông báo
        type: String,
        ref: 'account'
    },
    userIdGuest: { // id người mà tương tác để thông báo được gửi về cho người kia
        type: String,
        ref: 'account'
    },
    content: String,
    isChecked:{ // id người mà tương tác để thông báo được gửi về cho người kia
        type: Boolean,
        default:false
    },
    deletedFlag: { // sử dụng để xóa ( ẩn bài viết cho người dùng) ( soft delete)
        type: Boolean,
        default: false
    }
},{timestamps:true})
const notification = mongoose.model("notification",notificationSchema,"notification")

module.exports = notification