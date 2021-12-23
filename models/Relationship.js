const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const RelationShipSchema = mongoose.Schema({
    id: {
        type: String,
        default: uuidv4(),
    },
    member_id: {
        type: Array,
        // có id của 2 người kết bạn với nhau
    },
});

module.exports = mongoose.model('Relationship', RelationShipSchema);