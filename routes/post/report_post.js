const express = require('express');
const router = express.Router();
const Post = require('../../models/Post');
const User = require('../../models/User');

router.get('/subject_list', (req, res) => {
    res.json(subjectList);
});
const subjectList = ['Nội dung nhạy cảm', 'Làm phiền', 'Lừa đảo', 'Ngôn từ thù địch', 'Phân biệt chủng tộc']; // subject từ 0 - 1

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
                if (!post.banned) {
                    let reqSubject = req.body.subject;
                    // let reqDetails = req.body.details;
                    post.report = {
                        uuid: user.id,
                        subject: reqSubject,
                        subjectName: subjectList[reqSubject],
                        // details: reqDetails,
                    };
                    await post.save();
                    res.json({
                        code: 1000,
                        messgae: 'OK',
                    });
                } else {
                    res.json({
                        code: 1010,
                        message: 'This post is banned.',
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