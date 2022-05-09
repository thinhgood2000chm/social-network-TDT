const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// tách comment, lấy user ứng với id của userid trong từng copmment , load 10 bài viết 1 làn, load 10 comment ở lần 1 lần 2 khi bấm vào xem thêm comment sẽ load hết , trả thêm cờ để biết còn data 
// trogn list pót dùng 2 lần query để tìm ra và trả về cờ còn data và dữ liệu thực sự trả về 
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
    video: {
        type:String,
        default: null
    },
    like: {
        type:Array,
        default: null
    },
    rootPost:{
        type:String,
        default: null
    },

},{timestamps:true})
const post = mongoose.model("post", postSchema, "post")

module.exports = post