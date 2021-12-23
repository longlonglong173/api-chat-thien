const express = require('express');
const router = express.Router();
const User = require('../../models/User');
const Post = require('../../models/Post');
const RequestFriend = require('../../models/RequestFriend');

router.get('/', (req, res) => {
    res.json('GET PROFILE');
});

router.post('/', async(req, res) => {
    try {
        const reqUserId = req.body.user_id;
        const reqToken = req.body.token;
        if (reqUserId == null || reqToken == null) {
            return res.json({
                code: 1002,
                message: 'Parameter is not enough.',
            });
        }

        const user = await User.findOne({
            token: reqToken,
        }).exec();

        if (!user) {
            return res.json({
                code: 9998,
                message: 'Token is invalid.',
            });
        }

        const friend = await User.findOne({
            id: reqUserId,
        });

        if (!friend) {
            return res.json({
                code: 9995,
                message: 'User is not validated.',
            });
        }

        let postNumber = await Post.countDocuments({
            uuid: user.id,
        }).exec();

        const friendList = await RequestFriend.find({
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

        const isFriend = await RequestFriend.findOne({
            $or: [{
                    request_id: reqUserId,
                    receive_id: user.id,
                },
                {
                    request_id: user.id,
                    receive_id: reqUserId,
                },
            ],
        });

        let same_friend = 0;
        if (reqUserId != user.id) {
            // friend list id of user token
            let friendListId1 = [];
            for (let i = 0; i < friendList.length; i++) {
                const item = friendList[i];
                if (item.request_id == user.id) {
                    friendListId1.push(item.receive_id);
                } else if (item.receive_id == user.id) {
                    friendListId1.push(item.request_id);
                }
            }

            // friend list of user_id
            const friendList2 = await RequestFriend.find({
                $or: [{
                        request_id: reqUserId,
                    },
                    {
                        receive_id: reqUserId,
                    },
                ],
            }).find({
                is_accept: '1',
            });

            // friend list id of user_id
            let friendListId2 = [];
            for (let i = 0; i < friendList2.length; i++) {
                const item = friendList2[i];
                if (item.request_id == reqUserId) {
                    friendListId2.push(item.receive_id);
                } else if (item.receive_id == reqUserId) {
                    friendListId2.push(item.request_id);
                }
            }

            for (let i = 0; i < friendListId1.length; i++) {
                for (let j = 0; j < friendListId2.length; j++) {
                    if (friendListId1[i] == friendListId2[j]) {
                        same_friend++;
                    }
                }
            }
        }

        res.json({
            code: 1000,
            message: 'ok',
            data: {
                id: friend.id,
                username: friend.username,
                created: friend.createdAt,
                description: friend.description || '',
                avatar: friend.avatar,
                cover_image: friend.cover_image || '',
                link: friend.link || '',
                address: friend.address || '',
                city: friend.city || '',
                country: friend.country || '',
                listing: friendList.length || 0,
                is_friend: isFriend || false,
                phonenumber: friend.phonenumber,
                active: friend.avtive,
                online: friend.online,
                last_login: friend.loginTime[friend.loginTime.length - 1] || null,
                post_number: postNumber,
                birthday: friend.birthday,
                gender: friend.gender,
                same_friend: same_friend || 0,
            },
        });
    } catch {}
});

module.exports = router;