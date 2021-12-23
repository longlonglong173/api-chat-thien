const express = require('express');
const router = express.Router();
const User = require('../../models/User');
const RequestFriend = require('../../models/RequestFriend');

router.get('/', async(req, res) => {
    res.json('GET REQUESTED FRIEND API');
});

router.post('/', async(req, res) => {
    try {
        const reqUserId = req.body.user_id;
        const reqToken = req.body.token;
        const reqIndex = req.body.index || 0;
        const reqCount = req.body.count || 20;

        if (!reqToken || !reqUserId) {
            res.json({
                code: 1002,
                message: 'Parameter is not enough',
            });
        }

        const user = await User.findOne({
            token: reqToken,
        }).exec();
        if (!user) {
            res.json({
                code: 9998,
                message: 'Token is invalid.',
            });
        }
        const requestList = await RequestFriend.find({
            receive_id: user.id,
        }).find({ is_accept: '' });

        const requestListCopy = requestList.reverse().slice();

        if (requestListCopy.length == 0) {
            res.json({
                code: 1000,
                message: 'OK',
                data: {
                    friends: [],
                },
            });
        }

        const userList = await User.find();

        let listResult = [];
        for (let i = 0; i < requestListCopy.length; i++) {
            let item = requestListCopy[i];
            const requseter = userList.find((a) => {
                return a.id == item.request_id;
            });
            listResult.push({
                id: requseter.id,
                username: requseter.username,
                avatar: requseter.avatar,
                created: item.createdAt,
            });
        }

        const total = listResult.length;
        res.json({
            code: 1000,
            message: 'OK',
            data: {
                friends: listResult.splice(reqIndex, reqCount),
            },
            total: total,
        });
    } catch (error) {
        res.json({
            message: error,
        });
    }
});

module.exports = router;