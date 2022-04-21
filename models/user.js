const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const accountSchema = new Schema({
    iss: String,
    hd: String,
    fullname: String,
    email: String,
    picture: String,
    given_name: String,
    family_name: String,
    username: String,
    biography: String,
    className: String,
    faculty: String,
    post: [String],
    friends:[String],
    notification: [String],
    password:String
},{timestamps: true})

const account = mongoose.model("account", accountSchema, 'account')

module.exports = account