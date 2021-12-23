const express = require('express');
const router = express.Router();
const path = require('path');
const User = require(path.resolve('./models/User'));

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
        const user = await User.findOne({
            id: reqUserId,
        });

        if (!user) {
            res.json({
                code: 9995,
                message: 'User is not validated.',
            });
        }

        await User.findOneAndDelete({
            id: reqUserId,
        });

        res.json({
            code: 1000,
            message: 'OK',
        });
    } catch {
        res.json(err);
    }
});

module.exports = router;