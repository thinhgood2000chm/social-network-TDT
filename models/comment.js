const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const commentSchema = new Schema({
    postId: {
        type:String, 
        required:true
    },
    userIdComment: {
        type:String,
        required:true
    },
    content: {
        type:String,
        required:true
    }
},{timestamps:true})
const comment = mongoose.model("comment",commentSchema,"comment")

module.exports = comment
