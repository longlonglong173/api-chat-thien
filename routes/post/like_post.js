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
                let isLikedPost = false;
                let likePosition = 0;
                post.liked.forEach((element, index) => {
                    if (element == user.id) {
                        isLikedPost = true;
                        likePosition = index;
                    }
                });
                if (isLikedPost) {
                    post.liked.splice(likePosition, 1);
                } else {
                    post.liked.push(user.id);
                }
                await post.save();
                res.json({
                    code: 1000,
                    messgae: 'OK',
                    data: {
                        like: post.liked.length,
                    },
                });
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