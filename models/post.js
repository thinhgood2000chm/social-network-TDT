const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// tách comment, lấy user ứng với id của userid trong từng copmment , load 10 bài viết 1 làn, load 10 comment ở lần 1 lần 2 khi bấm vào xem thêm comment sẽ load hết , trả thêm cờ để biết còn data 
// trogn list pót dùng 2 lần query để tìm ra và trả về cờ còn data và dữ liệu thực sự trả về 
const postSchema = new Schema({
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'account',
        required: true
    },
    content: {
        type: String,
        default: null
    },
    image: {
        type: [String],
        default: null
    },
    video: {
        type: String,
        default: null
    },
    likedBy: [{
        type: Schema.Types.ObjectId,
        ref: 'account'
    }],
    sharedBy: [{
        type: Schema.Types.ObjectId,
        ref: 'account'
    }],
    rootPost: {
        type: String,
        default: null
    },
}, { timestamps: true })
const post = mongoose.model("post", postSchema)

module.exports = post