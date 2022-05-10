const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const accountSchema = new Schema({
    hd: {
        type: String,
        default: null
    },
    fullname: {
        type: String,
        default: null
    },
    picture: {
        type: String,
        default: null
    },
    givenName: {
        type: String,
        default: null
    },
    familyName: {
        type: String,
        default: null
    },
    username: {
        type: String,
        required: true,
    }, // sử dụng chung username và email là 1, username dùng cho admin còn student sẽ lưu lại email ở đây 
    biography: {
        type: String,
        default: null
    },
    className: {
        type: String,
        default: null
    },
    faculty: {
        type: String,
        default: null
    },
    // post: [{
    //     // nếu là bài tự đăng thì sharepostId sẽ null, còn bài share thì sẽ có đủ id của sharePost và rootPost
    //     // cần 2 id để check không được share 1 bài viết 2 lần trở lên ( trừ th đã xóa bài share đó và share lại thì được)
    //     rootPostId: { // bài gốc: id bài tự đăng hoặc id của bài mà đã share 
    //         type: String,
    //         
    //         default: null
    //     },
    //     sharePostId: { // id được tạo sau khi bấm share bài người khác 
    //         type: String,
    //         
    //         default: null
    //     },
    // }],
    friends: [this], // this schema
    // notification: { // lưu lai id thông báo 
    //     type: [String],
    //     
    //     default: null
    // },
    password: {
        type: String,
        required: true,
    }
}, { timestamps: true })

const account = mongoose.model("account", accountSchema, "account")

module.exports = account