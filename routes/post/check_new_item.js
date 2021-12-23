const express = require('express');
const router = express.Router();
const Post = require('../../models/Post');

router.post('/', async(req, res) => {
    try {
        if (req.body.last_id) {
            let listPost = await Post.find();
            // sắp xếp lại từ bài mới nhất đến cũ nhất
            listPost = listPost.reverse();
            let newItem = listPost.length;
            listPost.forEach((item, index) => {
                if (req.body.last_id === item.id) {
                    newItem = listPost.length - index - 1;
                }
            });
            res.json({
                code: 1000,
                message: 'OK',
                data: {
                    new_items: newItem,
                },
            });
        }
    } catch (error) {
        res.json({
            message: error,
        });
    }
});

module.exports = router;