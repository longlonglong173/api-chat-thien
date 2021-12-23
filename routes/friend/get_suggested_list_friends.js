const express = require('express');
const router = express.Router();
const path = require('path');
const User = require(path.resolve('./models/User'));
const RequestFriend = require(path.resolve('./models/RequestFriend'));

router.get('/', (req, res) => {
    res.json('GET SUGGESTED LIST FRIEND API');
});

router.post('/', async(req, res) => {
    try {
        const reqToken = req.body.token || null;
        const reqIndex = req.body.index || 0;
        const reqCount = req.body.count || 20;

        if (!reqToken) {
            return res.json({
                code: 1002,
                message: 'Parameter is not enough.',
            });
        }

        const user = await User.findOne({
            token: reqToken,
        });
        if (!user) {
            return res.json({
                code: 9998,
                message: 'Token is invalid.',
            });
        }

        //----------------------xử lý lấy danh sách bạn bè của user hiện tại ------------------------
        let userFriendList = await RequestFriend.find({
            $or: [{
                    receive_id: user.id,
                },
                {
                    request_id: user.id,
                },
            ],
        }).find({
            is_accept: '1',
        });

        let userFriendListId = [];

        for (let i = 0; i < userFriendList.length; i++) {
            if (userFriendList[i].receive_id == user.id) {
                userFriendListId.push(userFriendList[i].request_id);
            } else if (userFriendList[i].request_id == user.id) {
                userFriendListId.push(userFriendList[i].receive_id);
            }
        }

        let allUserRequest = await RequestFriend.find({
            $or: [{
                    receive_id: user.id,
                },
                {
                    request_id: user.id,
                },
            ],
        });
        // console.log(allUserRequest);
        // danh sách của tất của id có mối quan hệ với user (đã gửi kết bạn, hoặc đã là bạn bè )
        let allUserRequestId = [];

        for (let i = 0; i < allUserRequest.length; i++) {
            if (allUserRequest[i].receive_id == user.id) {
                allUserRequestId.push(allUserRequest[i].request_id);
            } else if (allUserRequest[i].request_id == user.id) {
                allUserRequestId.push(allUserRequest[i].receive_id);
            }
        }

        // xử lý lấy danh sách bạn bè của các user khác
        const userList = await User.find({
            id: { $ne: user.id },
        });
        const userListCopy = userList.slice().reverse();
        const allRequestFriend = await RequestFriend.find({
            $and: [{
                    request_id: { $ne: user.id },
                },
                {
                    receive_id: { $ne: user.id },
                },
            ],
        });
        const allRequestFriendCopy = allRequestFriend.slice().reverse();
        let otherUserFriendList = [];

        // lấy danh sách bạn bè của người khác mà không phải là user
        for (let i = 0; i < userListCopy.length; i++) {
            let result = [];
            let friend = userList[i];
            for (let j = 0; j < allRequestFriendCopy.length; j++) {
                const requestFriend = allRequestFriendCopy[j];
                if (requestFriend.is_accept == '1') {
                    if (requestFriend.request_id == friend.id) {
                        result.push(requestFriend.receive_id);
                    } else if (requestFriend.receive_id == friend.id) {
                        result.push(requestFriend.request_id);
                    }
                }
            }
            otherUserFriendList.push({
                id: friend.id,
                friendList: result,
            });
        }

        let sameFriendList = [];

        // console.log(otherUserFriendList.length);
        for (let i = 0; i < otherUserFriendList.length; i++) {
            const otherList = otherUserFriendList[i].friendList;
            let sameFriend = 0;
            // xư lý đếm số bạn chung của user request lên và user đang xét
            for (let j = 0; j < otherList.length; j++) {
                for (let k = 0; k < userFriendListId.length; k++) {
                    if (otherList[j] == userFriendListId[k]) {
                        sameFriend++;
                    }
                }
            }
            const friend = userList.find((a) => {
                return a.id == otherUserFriendList[i].id;
            });
            sameFriendList.push({
                user_id: friend.id,
                username: friend.username,
                avatar: friend.avatar,
                same_friends: sameFriend,
            });
        }

        const userListSort = sameFriendList.sort((a, b) => {
            return b.same_friends - a.same_friends;
        });

        console.log(allUserRequestId);
        let userListSortCopy = userListSort.slice();
        // lọc những người đang là bạn với user request
        for (let i = userListSort.length - 1; i >= 0; i--) {
            console.log(i);
            for (let j = 0; j < userFriendListId.length; j++) {
                if (userListSort[i].user_id == userFriendListId[j]) {
                    userListSortCopy.splice(i, 1);
                }
            }
        }
        let userListSortCopy2 = userListSortCopy.slice();
        for (let i = userListSortCopy2.length - 1; i >= 0; i--) {
            for (let k = 0; k < allUserRequestId.length; k++) {
                if (userListSortCopy2[i].user_id == allUserRequestId[k]) {
                    userListSortCopy.splice(i, 1);
                }
            }
        }
        console.log(userListSortCopy);
        return res.json({
            code: 1000,
            message: 'OK',
            data: userListSortCopy.splice(reqIndex, reqCount),
        });
    } catch (error) {
        return res.json({
            message: error,
        });
    }
});

module.exports = router;