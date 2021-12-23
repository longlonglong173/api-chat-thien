const express = require('express');
const router = express.Router();
const User = require('../../models/User');

router.get('/', async(req, res) => {
    res.json('DELETE SAVED SEARCH API');
});

router.post('/', async(req, res) => {
    try {
        const reqToken = req.body.token;
        const reqSearchId = req.body.search_id;
        const reqAll = req.body.all; // nếu truyền lên là 1 thì không cần phần reqSearchId, còn nếu là 0 thì phải cần reqSearchId

        if (!reqAll && !reqSearchId) {
            res.json({
                code: 1002,
                message: 'Parameter is not enough.',
            });
        }

        if (!reqToken) {
            res.json({
                code: 1002,
                message: 'Parameter is not enough.',
            });
        }

        if (reqSearchId == 0 && !reqSearchId) {
            res.json({
                code: 1002,
                message: 'Parameter is not enough.',
            });
        }
        if (reqAll && reqAll != 0 && reqAll != 1) {
            res.json({
                code: 1004,
                message: 'Parameter value is invalid.',
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

        if (reqAll == 1) {
            user.search_history = [];
            await user.save();
            res.json({
                code: 1000,
                message: 'OK',
            });
        } else {
            let index = -1;
            for (let i = 0; i < user.search_history.length; i++) {
                if (user.search_history[i].id == reqSearchId) {
                    index = i;
                }
            }
            if (index >= 0) {
                user.search_history.splice(index, 1);
                await user.save();
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