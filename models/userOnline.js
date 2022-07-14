const mongoose = require("mongoose")
const Schema = mongoose.Schema;
const userOnlineSchema = new Schema({
    userId: String,
    socketId: String,
    status: {
        type: Boolean,
        default: false
    }

},{timestamps:true})
const userOnline = mongoose.model("userOnline",userOnlineSchema,"userOnline")

module.exports = userOnline
