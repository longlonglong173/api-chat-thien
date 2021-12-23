const express = require('express');
const router = express.Router();
const User = require('../../models/User');

router.get('/', async(req, res) => {
    res.json('CHANGE PASSWORD API');
});

router.post('/', async(req, res) => {
    try {
        const reqToken = req.body.token || null;
        const reqPassword = req.body.password || '';
        const reqNewPassword = req.body.new_password || '';

        if (!reqToken || !reqPassword || !reqNewPassword) {
            return res.json({
                code: 1002,
                message: 'Parameter is not enough.',
            });
        }
        const regexPassword = new RegExp(/^[a-zA-Z0-9]{6,10}$/);
        const checkNewPassword = regexPassword.test(reqNewPassword);

        if (!checkNewPassword || reqPassword == reqNewPassword) {
            return res.json({
                code: 1003,
                message: 'New password is invalid.',
            });
        }

        let user = await User.findOne({
            token: reqToken,
        });
        if (!user) {
            return res.json({
                code: 9998,
                message: 'Token is invalid.',
            });
        }

        if (user.password != reqPassword) {
            return res.json({
                code: 9993,
                message: 'Password is incorrect.',
            });
        } else {
            user.password = reqNewPassword;
            await user.save();
        }
        return res.json({
            code: 1000,
            message: 'OK',
        });
    } catch (error) {
        return res.json({
            message: error,
        });
    }
});

module.exports = router;