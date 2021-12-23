const express = require('express');
const router = express.Router();
const User = require('../../models/User');
const RequestFriend = require('../../models/RequestFriend');

router.get('/', async(req, res) => {
    res.json('SET REQUEST FRIEND API');
});

router.post('/', async(req, res) => {
    try {
        const reqUserId = req.body.user_id;
        const reqToken = req.body.token;

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
        const receiver = await User.findOne({
            id: reqUserId,
        }).exec();

        if (!receiver) {
            res.json({
                code: 9995,
                message: 'User is not validated.',
            });
        }

        let isExitedRequest = await RequestFriend.findOne({
            request_id: user.id,
        }).findOne({
            receive_id: reqUserId,
        });

        let result = null;
        if (isExitedRequest) {
            isExitedRequest.is_accept = '';
            await isExitedRequest.save();
            return res.json({
                code: 9996,
                message: 'Request is existed.',
            });
        } else {
            result = await RequestFriend({
                request_id: user.id,
                receive_id: reqUserId,
            }).save();

            if (result) {
                return res.json({
                    code: 1000,
                    message: 'OK',
                });
            }
        }
    } catch (error) {
        res.json({
            message: error,
        });
    }
});

module.exports = router;