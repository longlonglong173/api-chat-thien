const express = require('express');
const router = express.Router();
const Post = require('../../models/Post');
const User = require('../../models/User');
// const { v1: uuidv1 } = require('uuid');

// FUNCTION
function isBlocked(uuid, post) {
    const isBlocked = post.blocked.find((item) => item === uuid);
    if (isBlocked) {
        return true;
    } else {
        return false;
    }
}

function isLikedPost(uuid, post) {
    const isLikedPost = post.liked.find((item) => item === uuid); // tim thay => true => khong the getpost
    if (isLikedPost != null) {
        return true;
    } else if (isLikedPost == null) {
        return false;
    }
}

function canEditPost(user, author) {
    if (user.id === author.id) {
        return true;
    } else return false;
}

// GET ALL POST
router.get('/', async(req, res) => {
    res.json('GET POST API');
});

// GET A POST
router.post('/', async(req, res) => {
    try {
        const post = await Post.findOne({
            id: req.body.id,
            token: req.body.token,
        }).exec();
        if (post) {
            // take info author's post
            let authorForm = {};
            const author = await User.findOne({ id: post.uuid }).exec();
            if (author) {
                authorForm = {
                    id: author.id,
                    username: author.username,
                    avatar: author.avatar,
                    online: author.online,
                };
            }

            // take user's information
            const user = await User.findOne({ token: req.body.token }).exec();

            //result
            const result = {
                code: 1000,
                message: 'OK',
                data: {
                    id: post.id,
                    described: post.described,

                    like: post.liked.length,
                    comment: post.comment.length,
                    is_liked: isLikedPost(user.id, post),
                    image: post.image, //array object image
                    video: post.video, //object video
                    author: authorForm,
                    state: post.state,
                    is_blocked: isBlocked(user.id, post),
                    can_edit: canEditPost(user, author),
                    banned: post.banned,
                    can_comment: post.canComment,
                },
            };
            return res.json(result);
        }
    } catch (err) {
        res.json({ message: 'Fail to get post' });
    }
});

module.exports = router;