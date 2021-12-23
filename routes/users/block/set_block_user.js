const express = require('express');
const router = express.Router();
const User = require('../../../models/User');
const RequestFriend = require('../../../models/RequestFriend');

router.get('/', async(req, res) => {
    res.json('SET BLOCK USER API');
});

router.post('/', async(req, res) => {
    try {
        const reqUserId = req.body.user_id;
        const reqToken = req.body.token;
        const reqType = req.body.type; // 0 là block, 1 là unblock
        if (!reqToken || !reqUserId || !reqType) {
            res.json({
                code: 1002,
                message: 'Parameter is not enough.',
            });
        }

        if (reqType != 0 && reqType != 1) {
            res.json({
                code: 1004,
                message: 'Parameter value is invalid.',
            });
        }

        let user = await User.findOne({
            token: reqToken,
        }).exec();
        if (!user) {
            res.json({
                code: 9998,
                message: 'Token is invalid.',
            });
        }

        const blockedUser = await User.findOne({
            id: reqUserId,
        }).exec();

        if (!blockedUser) {
            res.json({
                code: 9995,
                message: 'User is not validated.',
            });
        }

        const indexOfBlockedUser = user.blocked_message.indexOf(reqUserId);

        console.log(indexOfBlockedUser);
        if (reqType == 1) {
            if (indexOfBlockedUser == -1) {
                res.json({
                    code: 1000,
                    message: 'OK',
                });
            } else if (indexOfBlockedUser >= 0) {
                console.log('run');
                user.blocked_message.splice(indexOfBlockedUser, 1);

                await user.save();
                res.json({
                    code: 1000,
                    message: 'OK',
                });
            }
        } else if (reqType == 0) {
            if (indexOfBlockedUser == -1) {
                user.blocked_message.push(reqUserId);
                user.save();
                res.json({
                    code: 1000,
                    message: 'OK',
                });
            } else if (indexOfBlockedUser >= 0) {
                res.json({
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