const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const accountSchema = new Schema({
    hd: {
        type:String,
        required:false,
        default:null
    },
    fullname: {
        type:String,
        required:false,
        default:null
    },
    picture: {
        type:String,
        required:false,
        default:null
    },
    givenName: {
        type:String,
        required:false,
        default:null
    },
    familyName: {
        type:String,
        required:false,
        default:null
    },
    username: {
        type:String,
        required:true,

    }, // sử dụng chung username và email là 1, username dùng cho admin còn student sẽ lưu lại email ở đây 
    biography: {
        type:String,
        required:false,
        default:null
    },
    className:{
        type:String,
        required:false,
        default:null
    },
    faculty:{
        type:String,
        required:false,
        default:null
    },
    post:{
        type:[String],
        required:false,
        default:null
    },
    friends:{
        type:[String],
        required:false,
        default:null
    },
    notification: {
        type:[String],
        required:false,
        default:null
    },
    password:{
        type:String,
        required:true,

    }
},{timestamps: true})

const account = mongoose.model("account", accountSchema, 'account')

module.exports = account