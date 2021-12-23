const express = require('express');
const router = express.Router();
const Post = require('../../models/Post');
const User = require('../../models/User');

// FUNCTION
//sort  từ mới nhất đến cũ nhất
sortByDateDescAndTimeAscDateObj = function(lhs, rhs) {
    lhs = lhs.createdAt;
    rhs = rhs.createdAt;
    let results;

    results =
        lhs.getYear() > rhs.getYear() ?
        1 :
        lhs.getYear() < rhs.getYear() ?
        -1 :
        0;

    if (results === 0)
        results =
        lhs.getMonth() > rhs.getMonth() ?
        1 :
        lhs.getMonth() < rhs.getMonth() ?
        -1 :
        0;

    if (results === 0)
        results =
        lhs.getDate() > rhs.getDate() ?
        1 :
        lhs.getDate() < rhs.getDate() ?
        -1 :
        0;

    if (results === 0)
        results =
        lhs.getHours() < rhs.getHours() ?
        1 :
        lhs.getHours() > rhs.getHours() ?
        -1 :
        0;

    if (results === 0)
        results =
        lhs.getMinutes() < rhs.getMinutes() ?
        1 :
        lhs.getMinutes() > rhs.getMinutes() ?
        -1 :
        0;

    if (results === 0)
        results =
        lhs.getSeconds() < rhs.getSeconds() ?
        1 :
        lhs.getSeconds() > rhs.getSeconds() ?
        -1 :
        0;

    return results;
};

function isBlocked(uuid, post) {
    const isBlocked = post.blocked.find((item) => item === uuid);
    if (isBlocked) {
        return true;
    } else {
        return false;
    }
}

function isUserLikedPost(uuid, post) {
    const isLikedPost = post.liked.find((item) => item === uuid); // tim thay => true => khong the getpost
    if (isLikedPost) {
        return true;
    } else {
        return false;
    }
}

function isUserIsBlocked(uuid, post) {
    const isBlocked = post.blocked.find((item) => item === uuid); // tim thay => true => khong the getpost
    if (isBlocked) {
        return true;
    } else {
        return false;
    }
}

function getRelatedName(post, userList) {
    let totalRealted = [];
    // lấy tất cả user id có tương tác với bài
    userList.forEach((item1) => {
        let item1Id = item1.id;
        post.liked.forEach((item2) => {
            if (item2 === item1Id) {
                totalRealted.push(item2);
            }
        });
        post.disliked.forEach((item3) => {
            if (item3 === item1Id) {
                totalRealted.push(item3);
            }
        });
        post.comment.forEach((item4) => {
            if (item4.id === item1Id) {
                totalRealted.push(item4.id);
            }
        });
    });
    // lọc tất cả những id trùng nhau vì đều là 1 người cả,
    // đề yêu cầu lấy những người có tương tác với bài
    totalRealted.forEach((item1, index1) => {
        totalRealted.forEach((item2, index2) => {
            if (item1 === item2 && index1 !== index2) {
                totalRealted.splice(index2--, 1);
            }
        });
    });
    // console.log(totalRealted);
    let relatedName = [];
    userList.forEach((item1) => {
        totalRealted.forEach((item2) => {
            if (item1.id === item2) {
                relatedName.push(item1.username);
            }
        });
    });
    return relatedName;
}

// GET ALL POST
router.get('/', (req, res) => {
    res.json('GET LIST POST API');
});

// GET A POST
router.post('/', async(req, res) => {
    try {
        const startIndex = req.body.index ? req.body.index : 0;
        const count = req.body.count ? req.body.count : 20;
        const user = await User.findOne({ token: req.body.token });
        const lastId = req.body.last_id ? req.body.last_id : null; //last index => index cuối của mảng trong lần request trước
        const usersList = await User.find();
        let postsList = await Post.find();
        let postListCopy = postsList.slice().reverse();
        if (startIndex >= postListCopy.length) {
            res.json({ code: 1703, message: 'Het bai viet =' });
        } else {
            let postListSlice = postListCopy.splice(startIndex, count);
            let postsListResult = [];
            postListSlice.forEach((post, index) => {
                let author = {};
                usersList.forEach((item) => {
                    if (item.id === post.uuid) {
                        author = {
                            id: item.id,
                            username: item.username,
                            avatar: item.avatar,
                            online: item.online,
                        };
                        return;
                    }
                });
                console.log(author);
                postsListResult.push({
                    id: post.id,
                    name: getRelatedName(post, postListSlice),
                    image: post.image || [],
                    video: post.video || {},
                    described: post.described || '',
                    created: post.createdAt,
                    like: post.liked.length || 0,
                    comment: post.comment.length || 0,
                    is_liked: isUserLikedPost(user.id, post),
                    is_blocked: isUserIsBlocked(user.id, post),
                    can_comment: post.canComment,
                    can_edit: user.id === post.uuid,
                    author: author,
                });
            });
            console.log(postsListResult);
            const result = {
                code: 1000,
                message: 'OK',
                data: {
                    posts: postsListResult,
                },
                new_items: 0,
                last_id: postListSlice[postListSlice.length - 1].id,
            };
            res.json(result);
        }
    } catch (err) {
        res.json({ message: 'Fail to get list post' });
    }
});

module.exports = router;