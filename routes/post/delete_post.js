const express = require('express');
const router = express.Router();
const Post = require('../../models/Post');
const User = require('../../models/User');

router.get('/', (req, res) => {
    res.json('GET');
});

router.post('/', async(req, res) => {
    try {
        let user = await User.findOne({
            token: req.body.token,
        });
        if (user) {
            let post = await Post.findOne({
                id: req.body.id,
            });
            if (post) {
                // chưa làm admin
                if (user.role == 'admin' || user.id == post.uuid) {
                    await Post.findOneAndDelete({
                        id: req.body.id,
                    });
                    res.json({
                        code: 1000,
                        messgae: 'OK',
                    });
                } else {
                    res.json({
                        code: 1009,
                        message: 'Not access.',
                    });
                }
            } else {
                res.json({
                    code: 9992,
                    message: 'Post is not exited.',
                });
            }
        } else {
            res.json({
                code: 9998,
                message: 'Token is invalid.',
            });
        }
    } catch {}
});

module.exports = router;