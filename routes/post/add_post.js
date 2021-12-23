const express = require('express');
const router = express.Router();
const Post = require('../../models/Post')
const User = require('../../models/User');
const { v4: uuidv1 } = require('uuid');
// const multer = require('multer');
// const ffmpeg = require('fluent-ffmpeg');
// const pathToFfmpeg = require('ffmpeg-static');
// ffmpeg.setFfmpegPath(pathToFfmpeg);
const fs = require('fs');

router.post('/', async(req, res) => {
    try {
        if (!req.body.token) {
            res.json({
                code: 1002,
                message: 'Parameter is not enought.',
            });
        } else if (req.body.token && req.body.described && !req.files) {
            const author = await User.findOne({
                token: req.body.token,
            }).exec();
            const postId = uuidv1();
            const data = {
                id: postId,
                uuid: author.id,
                described: req.body.described,
                image: [],
                video: {},
            };
            const post = new Post(data);
            await post.save();
            res.json({
                code: 1000,
                message: 'OK',
                data: {
                    id: post.id,
                    url: post.url,
                },
            });
        } else if (req.body.token) {
            const postId = uuidv1();
            const author = await User.findOne({
                token: req.body.token,
            }).exec();
            const data = {
                id: postId,
                uuid: author.id,
                described: req.body.described,
                image: image,
                video: videoResult,
            };
            const post = new Post(data);
            await post.save();
            res.json({
                code: 1000,
                message: 'OK',
                data: {
                    id: post.id,
                    url: post.url,
                },
            });
        }
    } catch (err) {
        res.json({
            code: 1005,
            message: 'Unknow error.',
        });
    }
});
module.exports = router;