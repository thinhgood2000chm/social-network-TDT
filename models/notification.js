const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const notificationSchema = new Schema({
    id: string,
    user_id: string,
    content: string
},{timestamps:true})
const notification = mongoose.model("notification",notificationSchema,"notification")

module.exports = notification