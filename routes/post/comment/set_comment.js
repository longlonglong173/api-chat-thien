const express = require('express');
const router = express.Router();
const Post = require('../../../models/Post');
const User = require('../../../models/User');
const { v4: uuidRandom } = require('uuid');

router.get('/', (req, res) => {
    res.json('SET COMMENT API');
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
                // handle blocker
                //START MAIN CONTENT-----------------------------------------------------
                let reqIndex = req.body.index;
                let reqCount = req.body.count;
                let reqComment = req.body.comment;
                post.comment.push({
                    id: uuidRandom(),
                    comment: reqComment,
                    uuid: user.id,
                    createdAt: Date.now(),
                });
                await post.save();

                //handle blocked
                let isBlocked = false;
                if (post.comment) {
                    for (let i = 0; i < post.comment.length; i++) {
                        if (post.comment[i].uuid === user.id) {
                            isBlocked = true; // kiem tra lai
                        }
                    }
                }
                let commentListCount = post.comment.slice();
                commentListCount = commentListCount.reverse();
                commentListCount = commentListCount.splice(reqIndex, reqCount);
                let commentListResult = [];
                let userList = await User.find();

                commentListCount.forEach((comment) => {
                    let authorComment = '';
                    userList.forEach((item) => {
                        if (item.id === comment.uuid) {
                            authorComment = item;
                            // console.log(authorComment);
                        }
                    });
                    commentListResult.push({
                        id: comment.id,
                        comment: comment.comment,
                        created: comment.createdAt,
                        poster: {
                            id: comment.uuid,
                            name: authorComment.username,
                            avatar: authorComment.avatar,
                        },
                    });
                });
                res.json({
                    code: 1000,
                    messgae: 'OK',
                    data: commentListResult,

                    totalComment: post.comment.length,
                    is_blocked: isBlocked,
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