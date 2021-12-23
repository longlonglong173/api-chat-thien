const express = require('express');
const router = express.Router();
const Post = require('../../models/Post');
const User = require('../../models/User');

const { v4: uuidv4 } = require('uuid');

// method

function removeRepeatedPost(postList) {
    let postResult = postList.reduce((unique, o) => {
        if (!unique.some((obj) => obj.id === o.id)) {
            unique.push(o);
        }
        return unique;
    }, []);
    return postResult;
}

router.get('/', (req, res) => {
    res.json('GET SEARCH API');
});

router.post('/', async(req, res) => {
    try {
        const reqToken = req.body.token;
        const reqKeyWord = req.body.keyword.trim();
        const reqUserId = req.body.user_id;
        const reqIndex = req.body.index || 0;
        const reqCount = req.body.count || 10;

        if (!reqToken || !reqKeyWord) {
            return res.json({
                code: 1002,
                message: 'Parameter is not enough',
            });
        }

        let user = await User.findOne({
            token: reqToken,
        });
        if (!user) {
            return res.json({
                code: 9998,
                message: 'Token is invalid.',
            });
        }

        const userList = await User.find();
        const postList = await Post.find();

        // save keyword to search history

        // user.search_history.push({
        //     keyword: reqKeyWord,
        //     id: uuidv4(),
        //     createdAt: Date.now(),
        // });
        // user.save();

        // search post
        let postSearch = [];
        let postSearchDescribed = await Post.find({
            described: { $regex: reqKeyWord, $options: 'i' },
        });
        // search by author name
        let postSearchAuthorName = [];
        for (let i = 0; i < postList.length; i++) {
            const authorPostId = postList[i].uuid;
            const authorPost = userList.find(
                (element) => element.id === authorPostId
            );
            if (authorPost != null) {
                if (authorPost.username.toLowerCase().includes(reqKeyWord)) {
                    postSearchAuthorName.push(postList[i]);
                }
            }
        }
        let postListConcat = postSearchDescribed.concat(postSearchAuthorName);
        const postRemoved = removeRepeatedPost(postListConcat);
        let postResult = [];
        for (let i = 0; i < postRemoved.length; i++) {
            const post = postRemoved[i];
            const isUserLikedPost = post.liked.find((item) => item === user.id);
            const author = userList.find((item) => {
                return item.id === post.uuid;
            });
            if (author != null) {
                let data = {
                    id: post.id,
                    image: post.image,
                    video: post.video,
                    like: post.liked.length || 0,
                    comment: post.comment.length || 0,
                    is_liked: isUserLikedPost,
                    author: {
                        id: author.id,
                        username: author.username,
                        avatar: author.avatar,
                    },
                    described: post.described,
                };
                postResult.push(data);
            }
        }
        //Search user
        // let userSearch = await User.find({
        //     username: { $regex: reqKeyWord, $options: 'i' },
        // });
        // let userResult = [];
        // for (let i = 0; i < userSearch.length; i++) {
        //     const item = userSearch[i];
        //     if (item.id !== user.id) {
        //         userResult.push({
        //             id: item.id,
        //             username: item.username,
        //             phonenumber: item.phonenumber,
        //             avatar: item.avatar,
        //             last_login: item.loginTime[item.loginTime.length - 1],
        //             online: item.online,
        //         });
        //     }
        // }



        let conversationResult = [];

        console.log('ok')
        res.json({
            code: 1000,
            message: 'OK',
            data: {
                posts: postResult.reverse().slice(reqIndex, reqCount),
                users: userResult.reverse().slice(reqIndex, reqCount),
                conversations: conversationResult,
            },
        });
    } catch {}
});

module.exports = router;