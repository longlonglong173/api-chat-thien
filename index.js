const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors'); // liên quan đến phần bảo mật phía server
const fileUpload = require('express-fileupload'); //noaif ra thì còn thể dùng 1 số cái multer
const path = require('path');
require('dotenv/config');

mongoose
    .connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        dbName: 'chatdb',
    })
    .then(() => console.log('[SERVER] Database connection SUCCESS'))
    .catch((err) =>
        console.log(`[SERVER] Database connection FAILURE - ${err.message}`)
    );

const server = require('http').createServer(app);
const socketio = require('socket.io');

const io = (module.exports.io = socketio(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
        credentials: true,
    },
}));

const ROUTE = process.env.PORT || 8800;

// MIDDLEWARE
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, OPTIONS, PUT, PATCH, DELETE'
    );
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-Requested-With,content-type'
    );
    res.setHeader('Access-Control-Allow-Credentials', true);

    next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(fileUpload());
// app.use(express.static(path.join(__dirname, 'routes/get_conversation.js')));

// middlewareD
app.use(express.json());
// app.use(helmet());
// app.use(morgan("common"));

// IMPORT ROUTES
// login and signup
const signupRoute = require('./routes/login_signup/signup');
app.use('/login_signup/signup', signupRoute);

const loginRoute = require('./routes/login_signup/login');
app.use('/login_signup/login', loginRoute);

const logoutRoute = require('./routes/login_signup/logout');
app.use('/login_signup/logout', logoutRoute);

const changePasswordRoute = require('./routes/login_signup/change_password');
app.use('/login_signup/change_password', changePasswordRoute);

//post
const reportPostRoute = require('./routes/post/report_post');
app.use('/post/report_post', reportPostRoute);

const addPostRoute = require('./routes/post/add_post');
app.use('/post/add_post', addPostRoute);

const updatePostRoute = require('./routes/post/update_post');
app.use('/post/update_post', updatePostRoute);

const deletePostRoute = require('./routes/post/delete_post');
app.use('/post/delete_post', deletePostRoute);

const getPostRoute = require('./routes/post/get_post');
app.use('/post/get_post', getPostRoute);

const getListPostsRoute = require('./routes/post/get_list_posts');
app.use('/post/get_list_posts', getListPostsRoute);

const checkNewItemRoute = require('./routes/post/check_new_item');
app.use('/post/check_new_item', checkNewItemRoute);

const likeRoute = require('./routes/post/like_post');
app.use('/post/like_post', likeRoute);

// comment
const getCommentRoute = require('./routes/post/comment/get_comment');
app.use('/post/comment/get_comment', getCommentRoute);

const setCommentRoute = require('./routes/post/comment/set_comment');
app.use('/post/comment/set_comment', setCommentRoute);

const editCommentRoute = require('./routes/post/comment/edit_comment');
app.use('/post/comment/edit_comment', editCommentRoute);

const deleteCommentRoute = require('./routes/post/comment/del_comment');
app.use('/post/comment/del_comment', deleteCommentRoute);

// friend
const setRequestFriendRoute = require('./routes/friend/set_request_friend');
app.use('/friend/set_request_friend', setRequestFriendRoute);

const getRequestedFriendRoute = require('./routes/friend/get_requested_friend');
app.use('/friend/get_requested_friend', getRequestedFriendRoute);

const setAcceptFriendRoute = require('./routes/friend/set_accept_friend');
app.use('/friend/set_accept_friend', setAcceptFriendRoute);

const getSuggestedListFriend = require('./routes/friend/get_suggested_list_friends');
app.use('/friend/get_suggested_list_friends', getSuggestedListFriend);

const getUserFriendsRoute = require('./routes/friend/get_user_friends');
app.use('/friend/get_user_friends', getUserFriendsRoute);

// search
const searchRoute = require('./routes/search/search_friend_message');
app.use('/search/search_friend_message', searchRoute);

const getSavedSearchRout = require('./routes/search/get_save_search');
app.use('/search/get_save_search', getSavedSearchRout);

const delSavedSearchRoute = require('./routes/search/del_save_search');
app.use('/search/del_save_search', delSavedSearchRoute);

// users
const setUserInfoRoute = require('./routes/users/set_user_info');
app.use('/users/set_user_info', setUserInfoRoute);

const getProfileRoute = require('./routes/users/get_user_info');
app.use('/users/get_user_info', getProfileRoute);

// chat
const setMessageRoute = require('./routes/chat/set_message');
app.use('/chat/set_message', setMessageRoute);

// block
const setBlockUserRoute = require('./routes/users/block/set_block_user');
app.use('/users/block/set_block_user', setBlockUserRoute);

const setBlockDiaryRoute = require('./routes/users/block/set_block_diary');
app.use('/users/block/set_block_diary', setBlockDiaryRoute);

// admin
const loginAdminRoute = require('./routes/admin/login_admin');
app.use('/admin/login_admin', loginAdminRoute);

const setUserStateRoute = require('./routes/admin/set_user_state');
app.use('/admin/set_user_state', setUserStateRoute);

const deleteUserRoute = require('./routes/admin/delete_user');
app.use('/admin/delete_user', deleteUserRoute);

const getBasicUserInfoRoute = require('./routes/admin/get_basic_user_info');
app.use('/admin/get_basic_user_info', getBasicUserInfoRoute);

const getUserListRoute = require('./routes/admin/get_user_list');
app.use('/admin/get_user_list', getUserListRoute);

app.listen(ROUTE, () => {
    console.log('Backend server is runningggggggggggggggggggg');
});
