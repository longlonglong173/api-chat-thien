const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const RequestFriendSchema = mongoose.Schema({
    id: {
        type: String,
        default: uuidv4(),
    },
    request_id: {
        type: String,
    },
    receive_id: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    is_accept: {
        type: String,
        default: '',
    },
});

module.exports = mongoose.model('RequestFriend', RequestFriendSchema);