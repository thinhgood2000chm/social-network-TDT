const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const conversationSchema = new Schema({
    members: [
        {
            type: Schema.Types.ObjectId,
            ref: 'account'
        }
    ]
}, { timestamps: true })
const conversation = mongoose.model("conversation", conversationSchema, "conversation")

module.exports = conversation
