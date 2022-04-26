const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
    userId: {
        type:String,
        required:true
    },
    content: {
        type:String,
        default: null
    }, 
    image: {
        type:[String],
        default: null
    },
    comment: [{
        userIdComment: {
            type:String,
            required:true
        },
        imageUserComment: {
            type:String,
            required:true
        },
        nameUserComment: {
            type:String,
            required:true
        },
        content: {
            type:String,
            required:true
        }
    }],
    video: {
        type:String,
        default: null
    },
    like: {
        type:[String],
        default: null
    },
    share:{
        type:[String],
        default: null
    }
},{timestamps:true})
const post = mongoose.model("post", postSchema, "post")

module.exports = post