const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
    user_id: String,
    content: String,
    image:[String],
    comment: [{
        emailUComment: String,
        imageUserComment: String,
        nameUserComment: String,
        content: String,
    }],
    video: String,
    like: [String],
    share:[String]
},{timestamps:true})
const post = mongoose.model("post",postSchema,"post")

module.exports= post