const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const notificationSchema = new Schema({
    id: String,
    userId:String,
    userIdGuest: String,
    content: String,
    deletedFlag: { // sử dụng để xóa ( ẩn bài viết cho người dùng) ( soft delete)
        type: Boolean,
        default: false
    }
},{timestamps:true})
const notification = mongoose.model("notification",notificationSchema,"notification")

module.exports = notification