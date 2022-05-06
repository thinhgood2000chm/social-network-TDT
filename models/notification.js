const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const notificationSchema = new Schema({
    id: String,
    userId:String,
    userIdGuest: String,
    content: String,
    deletedFlag: {
        type: Boolean,
        default: false
    }
},{timestamps:true})
const notification = mongoose.model("notification",notificationSchema,"notification")

module.exports = notification