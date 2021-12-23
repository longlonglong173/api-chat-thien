const express = require('express');
const router = express.Router();
const Post = require('../../../models/Post');
const User = require('../../../models/User');
const { v4: uuidv1 } = require('uuid');

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
            }).exec();
            if (post) {
                //START MAIN CONTENT-----------------------------------------------------
                let reqPostId = req.body.id;
                const reqCommentId = req.body.id_com;
                const reqComment = req.body.comment.trim();
                for (let i = 0; i < post.comment.length; i++) {
                    if (post.comment[i].id === reqCommentId) {
                        if (post.comment[i].uuid === user.id) {
                            post.comment[i].comment = reqComment;
                            post.comment[i].updatedAt = Date.now();
                        } else {
                            res.json({ code: 1009, message: 'Not access.' });
                        }
                    }
                }
                await Post.findOneAndUpdate({
                        id: reqPostId,
                    },
                    post, {
                        returnOriginal: false,
                    }
                );
                // post.save();

                res.json({
                    code: 1000,
                    messgae: 'OK',
                    // comment: post.comment,
                });
                //END MAIN CONTENT-----------------------------------------------------
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