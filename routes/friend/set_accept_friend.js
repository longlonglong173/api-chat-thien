const express = require('express');
const router = express.Router();
const User = require('../../models/User');
const RequestFriend = require('../../models/RequestFriend');

router.get('/', async(req, res) => {
    res.json('SET ACCEPT FRIEND API');
});

router.post('/', async(req, res) => {
    try {
        const reqUserId = req.body.user_id || null;
        const reqToken = req.body.token || null;
        const reqIsAccept = req.body.is_accept; // 1 la dong y 0 la deo dong y

        if (reqToken == null || reqUserId == null || reqIsAccept == null) {
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

        const result = await RequestFriend.findOneAndUpdate({
            request_id: reqUserId,
            receive_id: user.id,
        }, {
            is_accept: reqIsAccept,
        });

        if (result) {
            res.json({
                code: 1000,
                message: 'OK',
            });
        }
    } catch (error) {
        res.json({
            message: error,
        });
    }
});

module.exports = router;