const mongoose = require('mongoose');
// Change Dev Duc
const UsersSchema = mongoose.Schema({
    phonenumber: {
        type: String,
        require: true,
        default: '',
    },
    password: {
        type: String,
        require: true,
        default: '',
    },
    id: {
        type: String,
        unique: true,
        default: '',
    },
    username: {
        type: String,
        require: true,
        default: '',
    },
    token: {
        type: String,
        default: '',
        
    },
    avatar: {
        type: Object,
        default: '',
    },
    cover_image: {
        type: Object,
        default: '',
    },
    address: {
        type: String,
        default: '',
    },
    description: {
        type: String,
        default: '',
    },
    city: {
        type: String,
        default: '',
    },
    country: {
        type: String,
        default: '',
    },
    link: {
        type: String,
    },
    active: {
        type: Boolean,
        default: true,
    },
    online: {
        type: Boolean,
        default: false,
    },
    blocked: {
        type: Array,
        default: [],
        // khi type truyền lên là 1 thì k block => k có tên trong list, còn type = 0 thì phải có tên trong list
    },
    blocked_message: {
        type: Array,
        default: [],
        // khi type truyền lên là 1 thì k block => k có tên trong list, còn type = 0 thì phải có tên trong list
    },
    blocked_diary: {
        type: Array,
        default: [],
        // khi type truyền lên là 1 thì k block => k có tên trong list, còn type = 0 thì phải có tên trong list
    },
    role: {
        type: String,
        default: '',
    },
    loginTime: {
        type: Array,
        default: [],
    },
    search_history: {
        type: Array,
        default: [],
    },
    birthday: {
        type: String,
        default: Date.now(),
    },
    gender: {
        type: String,
        default: 'male',
    },
});

module.exports = mongoose.model('User', UsersSchema);