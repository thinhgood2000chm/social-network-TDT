const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const friendRequestSchema = new Schema({
    userReceiveId: {
        type:String,
        require: true
    },
    userRequest: {
        type: Schema.Types.ObjectId,
        ref: 'account'
    },
    status: {
        type: Boolean,
        default: false // false là trạng thái gửi lời mời kết bạn, true là bạn bè 
    }

})
const friendRequest = mongoose.model("friendRequest", friendRequestSchema, "friendRequest")

module.exports = friendRequest