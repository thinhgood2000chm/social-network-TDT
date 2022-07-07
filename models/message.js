const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const messageSchema = new Schema({
    conversationId: {
        type: String,
    },
    senderId: {
        type: Schema.Types.ObjectId,
        ref: 'account'
    },
    text: {
        type: String,
    },

}, { timestamps: true })
const message = mongoose.model("message", messageSchema, "message")

module.exports = message
