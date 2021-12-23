const express = require('express');
const router = express.Router();
const Post = require('../../../models/Post');
const User = require('../../../models/User');
const { v4: uuidv4 } = require('uuid');
// const { playcustomapp } = require('googleapis/build/src/apis/playcustomapp');

router.get('/', (req, res) => {
    res.json('GET');
});

router.post('/', async(req, res) => {
    try {
        const reqPostId = req.body.id || null;
        const reqToken = req.body.token || null;
        const reqCommentId = req.body.id_com || null;

        if (reqPostId == null || reqToken == null || reqCommentId == null) {
            return res.json({
                code: 1002,
                message: 'Parameter is not enought.',
            });
        }

        const user = await User.findOne({
            token: reqToken,
        }).exec();

        if (user == null) {
            res.json({
                code: 9998,
                message: 'Token is invalid.',
            });
        }

        let post = await Post.findOne({
            id: reqPostId,
        });

        if (post == null) {
            return res.json({
                code: 9992,
                message: 'Post is not existed.',
            });
        }

        for (let i = 0; i < post.comment.length; i++) {
            const comment = post.comment[i];
            if (comment.id == reqCommentId) {
                if (comment.uuid != user.id) {
                    return res.json({
                        code: 1009,
                        message: 'Not access.',
                    });
                } else {
                    post.comment.splice(i, 1);
                    await post.save();
                    return res.json({
                        code: 1000,
                        message: 'OK',
                    });
                }
            }
        }
        return res.json({
            code: 8888,
            message: 'Comment id not found',
        });
    } catch (error) {
        return res.json({
            message: error,
        });
    }
});

module.exports = router;