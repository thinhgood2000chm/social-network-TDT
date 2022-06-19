const mongoose = require("mongoose")
const Schema = mongoose.Schema;
const userOnlineSchema = new Schema({
    userId: String,
    socketId: String

},{timestamps:true})
const useOnline = mongoose.model("useOnline",userOnlineSchema,"useOnline")

module.exports = useOnline
