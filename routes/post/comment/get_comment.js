const express = require('express');
const router = express.Router();
const Post = require('../../../models/Post');
const User = require('../../../models/User');

router.get('/', (req, res) => {
    res.json('GET COMMENT API');
});

router.post('/', async(req, res) => {
    try {
        let user = await User.findOne({
            token: req.body.token,
        }).exec();
        if (user) {
            let post = await Post.findOne({
                id: req.body.id,
            }).exec();
            if (post) {
                //START MAIN CONTENT-----------------------------------------------------
                let reqIndex = req.body.index;
                let reqCount = req.body.count;

                //handle blocked
                let isBlocked = false;
                if (post.comment) {
                    for (let i = 0; i < post.blocked.length; i++) {
                        if (post.comment[i].uuid === user.id) {
                            isBlocked = true;
                        }
                    }
                }
                let commentListCount = post.comment.slice();
                commentListCount = commentListCount.reverse();
                commentListCount = commentListCount.splice(reqIndex, reqCount);
                let commentListResult = [];
                let userList = await User.find();
                for (let index = 0; index < commentListCount.length; index++) {
                    let comment = commentListCount[index];
                    let authorComment = null;

                    // userList.forEach((item) => {
                    //     if (item.id === comment.uuid) {
                    //         authorComment = item;
                    //         console.log("same");
                    //     }
                    // });
                    for (let i = 0; i < userList.length; i++) {
                        if (userList[i].id == comment.uuid) {
                            authorComment = userList[i];
                        }
                    }
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
                }
                res.json({
                    code: 1000,
                    messgae: 'OK',
                    data: commentListResult,
                    id: '', //id cua comment
                    comment: '', // noi dugng cua comment
                    created: '', //thoi gian comment duocc tao
                    poster: {
                        id: '', // id cua nguoi comment
                        name: '', //username cua nguoi di comment,
                        avatar: '', //data base64 ảnh của người đi comment
                    },
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