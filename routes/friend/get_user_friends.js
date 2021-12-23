const express = require('express');
const router = express.Router();
const RequestFriend = require('../../models/RequestFriend');
const User = require('../../models/User');

router.get('/', (req, res) => {
    res.json('GET USER FRIENDS API');
});

router.post('/', async(req, res) => {
    try {
        const reqToken = req.body.token;
        const reqUserId = req.body.user_id;
        const reqIndex = req.body.index || 0;
        const reqCount = req.body.count || 20;

        if (!reqToken || !reqUserId) {
            res.json({
                code: 1002,
                message: 'Parameter is not enough',
            });
        }
        const user = await User.findOne({
            token: reqToken,
            id: reqUserId,
        });
        if (!user) {
            res.json({
                code: 1009,
                message: 'Not access.',
            });
        }

        const getUserFriends = await RequestFriend.find({
            $or: [{
                    request_id: user.id,
                },
                {
                    receive_id: user.id,
                },
            ],
        }).find({
            is_accept: '1',
        });

        const totalFriend = getUserFriends.length;
        const getUserFriendsCopy = getUserFriends.reverse().slice();
        const getUserFriendsSplice = getUserFriendsCopy.splice(
            reqIndex,
            reqCount
        );

        // FORM
        let getUserFriendsResult = [];
        const userList = await User.find();
        for (let i = 0; i < getUserFriendsSplice.length; i++) {
            const item = getUserFriendsSplice[i];
            // const userIdIndex = item.member_id.indexOf(user.id);
            // let friendIdIndex = 0;
            // if (userIdIndex == 0) {
            //     friendIdIndex = 1;
            // }
            let friendId =
                item.request_id == user.id ? item.receive_id : item.request_id;
            // console.log(friendId);
            const friend = userList.find((f) => f.id == friendId);
            if (friend) {
                getUserFriendsResult.push({
                    id: friendId,
                    avatar: friend.avatar,
                    username: friend.username,
                    online: friend.online,
                });
            }
        }

        res.json({
            code: 1000,
            message: 'OK',
            data: {
                friends: getUserFriendsResult,
                total: totalFriend,
            },
        });
    } catch {}
});

module.exports = router;