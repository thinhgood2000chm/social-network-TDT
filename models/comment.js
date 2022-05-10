const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const commentSchema = new Schema({
    postId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'account',
        required: true
    },
    content: {
        type: String,
        required: true
    },
    likedBy: [{
        type: Schema.Types.ObjectId,
        ref: 'account'
    }],
    comment: [this]
}, { timestamps: true })
const comment = mongoose.model("comment", commentSchema, "comment")

module.exports = comment
