const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const ConversationRoomSchema = mongoose.Schema({
    conversation_id: {
        type: String,
        default: uuidv4(),
    },
    member_id: {
        type: Array,
        // có id của những người trong room chat
    },
    messageList: {
        type: Array,
        // list object gồm id và mesage tương ứng
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
});

module.exports = mongoose.model('ConversationRoom', ConversationRoomSchema);