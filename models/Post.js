const mongoose = require('mongoose');

function formatDay(timestamp) {
    var date = new Date(timestamp);
    var month = date.getMonth() + 1;
    var year = date.getFullYear();
    var day = date.getDate();
    return year + '/' + month + '/' + day;
}

const PostSchema = mongoose.Schema({


    id: {
        type: String,
        default: '',
        require: true,
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    uuid: {
        type: String,
        default: '',
        require: true,
    },
    // token: {
    //     type: String,
    //     default: '',
    //     require: true,
    // },
    described: {
        type: String,
        default: '',
        require: true,
    },
    url: {
        type: String,
        default: '',
    },
    image: {
        type: Array,
        // {
        //     id: ""
        //     url:""
        // }
    },
    video: {
        type: Object,
        default: {
            url: String,
            thumb: String,
        },
    },
    modified: {
        type: Boolean,
        default: false,
    },
    comment: {
        type: Array,
        default: [],
    },
    state: {
        type: String,
        default: '',
    },
    liked: {
        type: Array,
        default: [],
    },
    disliked: {
        type: Array,
        default: [],
    },
    blocked: {
        // luu nhung uuid cua nhung nguoi bi block
        type: Array,
        default: [],
    },
    banned: {
        type: Boolean,
        default: false,
    },
    canComment: {
        type: Boolean,
        default: true,
    },
    report: {
        type: Array,
        default: [],
    },
});

module.exports = mongoose.model('Post', PostSchema);