const express = require('express');
const router = express.Router();
const path = require('path');
const User = require(path.resolve('./models/User'));
const RequestFriend = require(path.resolve('./models/RequestFriend'));
const Post = require(path.resolve('./models/Post'));

router.get('/', (req, res) => {
    res.json('GET ADMIN PERMISSION API');
});

router.post('/', async(req, res) => {
    try {
        const reqToken = req.body.token || null;
        const reqUserId = req.body.user_id || null;
        const admin = await User.findOne({
            token: reqToken,
        }).exec();

        if (!reqToken || !reqUserId) {
            res.json({
                code: 1002,
                message: 'Parameter is not enough',
            });
        }

        if (!admin) {
            res.json({
                code: 9998,
                message: 'Token is invalid.',
            });
        }
        if (admin.role != 'admin') {
            res.json({
                code: 1009,
                message: 'Not access.',
            });
        }
        let user = await User.findOne({
            id: reqUserId,
        });
        if (!user) {
            res.json({
                code: 9995,
                message: 'User is not validated.',
            });
        }

        user.active = !user.active;
        await user.save();

        const listFriend = await RequestFriend.find({
            $or: [{
                    request_id: user.id,
                },
                {
                    receive_id: user.id,
                },
            ],
        }).find({
            is_accept: '1',
        });

        let numberOfPost = await Post.countDocuments({
            uuid: user.id,
        });

        res.json({
            code: 1000,
            message: 'OK',
            data: {
                user_id: user.id,
                username: user.username,
                address: user.address || '',
                online: user.online,
                isActive: user.active,
                avatar: user.avatar || '',
                friend_count: listFriend.length,
                post_count: numberOfPost,
                phonenumber: user.phonenumber,
            },
        });
    } catch {
        res.json(err);
    }
});

module.exports = router;