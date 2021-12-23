const express = require('express');
const router = express.Router();
const path = require('path');
const User = require(path.resolve('./models/User'));
const { v4: uuidv1 } = require('uuid');

router.get('/', (req, res) => {
    res.json('GET ADMIN PERMISSION API');
});

router.post('/', async(req, res) => {
    try {
        const reqToken = req.body.token || null;
        const reqIndex = req.body.index || 0;
        const reqCount = req.body.count || 20;

        const userList = await User.find();
        let userListCopy = userList.reverse().slice();

        if (reqToken == null) {
            return res.json({
                code: 1002,
                message: 'Parameter is not enough',
            });
        }

        const admin = await User.find({
            token: reqToken,
        });
        if (admin == null) {
            return res.json({
                code: 9998,
                message: 'Token is invalid.',
            });
        }

        let userListResult = [];
        userListCopy.forEach((user) => {
            if (user.role !== 'admin') {
                userListResult.push({
                    user_id: user.id,
                    avatar: user.avatar,
                    username: user.username,
                    phonenumber: user.phonenumber,
                    link: user.link || '',
                    online: user.online,
                    isActive: user.active,
                    lastLogin: user.loginHistory ?
                        user.loginHistory[user.loginHistory.length - 1] : null,
                });
            }
        });

        if (reqIndex >= userListResult.length) {
            return res.json({
                code: 1703,
                message: 'Maximum user',
            });
        }

        return res.json({
            code: 1000,
            message: 'OK',
            data: userListResult.splice(reqIndex, reqCount),
        });
    } catch {}
});

module.exports = router;