const express = require('express');
const router = express.Router();
const User = require('../../models/User');
const path = require('path');
const RequestFriend = require('../../models/RequestFriend');
const Post = require('../../models/Post');

router.get('/', async(req, res) => {
    res.json('SET USER INFO API');
});

router.post('/', async(req, res) => {
    const reqToken = req.body.token;
    const reqUsername = req.body.username || null;
    const reqDescription = req.body.description || null;
    const reqGender = req.body.gender || null;
    const reqAddress = req.body.address || null;
    const reqCity = req.body.city || null;
    const reqCountry = req.body.country | null;
    const reqLink = req.body.link || null;
    const reqBirthday = req.body.birthday || null;
    let reqCoverImage = null;
    let reqAvatar = null;

    if (req.files) {
        if (req.files.avatar != null) {
            reqAvatar = req.files.avatar;
        }
        if (req.files.cover_image != null) {
            reqCoverImage = req.files.cover_image;
        }
    }

    try {
        if (!reqToken) {
            return res.json({
                code: 1002,
                message: 'Parameter is not enough.',
            });
        }
        if (
            (reqAvatar != null && typeof reqAvatar.length == 'number') ||
            (reqCoverImage != null && typeof reqCoverImage.length == 'number')
        ) {
            return res.json({
                code: 1008,
                message: 'Maximum number of images',
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
        if (reqUsername != null) {
            user.username = reqUsername;
        }
        if (reqDescription != null) {
            user.description = reqDescription;
        }
        if (reqGender != null) {
            user.gender = reqGender;
        }
        if (reqAddress != null) {
            user.address = reqAddress;
        }
        if (reqCity != null) {
            user.city = reqCity;
        }
        if (reqCountry != null) {
            user.country = req.body.country;
        }
        if (reqLink != null) {
            user.link = reqLink;
        }
        if (reqBirthday != null) {
            user.birthday = reqBirthday;
        }
        if (reqCoverImage != null) {
            let url = await gcs.uploadFileToGCS(reqCoverImage, 'images/');
            user.cover_image = url;
            await user.save();
        }
        if (reqAvatar != null) {
            let url = await gcs.uploadFileToGCS(reqAvatar, 'images/');
            user.avatar = url;
            await user.save();
        }
        await user.save();

        const newUser = await User.findOne({
            token: reqToken,
        });

        let postNumber = await Post.countDocuments({
            uuid: newUser.id,
        }).exec();

        const friendList = await RequestFriend.find({
            $or: [{
                    request_id: newUser.id,
                },
                {
                    receive_id: newUser.id,
                },
            ],
        }).find({
            is_accept: '1',
        });

        res.json({
            code: 1000,
            message: 'OK',
            data: {
                id: newUser.id,
                username: newUser.username,
                created: newUser.createdAt,
                description: newUser.description || '',
                avatar: newUser.avatar,
                cover_image: newUser.cover_image || '',
                link: newUser.link || '',
                address: newUser.address || '',
                city: newUser.city || '',
                country: newUser.country || '',
                listing: friendList.length || 0,
                phonenumber: newUser.phonenumber,
                active: newUser.avtive,
                online: newUser.online,
                last_login: newUser.loginTime[newUser.loginTime.length - 1] || null,
                post_number: postNumber,
                birthday: newUser.birthday,
                gender: newUser.gender,
            },
        });
    } catch (error) {
        res.json({
            message: error,
        });
    }
});

module.exports = router;