const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const messageSchema = new Schema({
    conversationId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'conversation'
    },
    senderId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'account'
    },
    text: {
        type: String,
        required: true
    }

}, { timestamps: true })
const message = mongoose.model("message", messageSchema, "message")

module.exports = message
