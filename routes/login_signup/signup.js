const express = require('express');
const router = express.Router();
const User = require('../../models/User');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
// const gcs = require(path.join(__dirname, '../helpers/uploadFileToGCS.js'));

// CHECK PHONE NUMBER, PASSWORRD
function check(phonenumber, password) {
    const regexphoneNumber = new RegExp(/^0\d{9}$/);
    const regexPassword = new RegExp(/^[a-zA-Z0-9]{6,10}$/);
    const phonenumberCheck = regexphoneNumber.test(phonenumber);
    const passwordCheck = regexPassword.test(password);
    if (phonenumberCheck && passwordCheck && phonenumber !== password) {
        // console.log('Success  check!!!');
        return true;
    } else {
        // console.log('FAIL check !!!');
        return false;
    }
}

// GET ALL POST
router.get('/', async(req, res) => {
    res.json('api signup');
});

// SIGNUP A ACCOUNT
router.post('/', async(req, res) => {
    try {
        const reqPhonenumber = req.body.phonenumber;
        const reqPassword = req.body.password;

        if (req.body.password == null || req.body.phonenumber == null) {
            return res.json({
                code: 1002,
                message: 'Parameter is not enough.',
            });
        }

        if (!check(req.body.phonenumber, req.body.password)) {
            return res.json({
                code: 1004,
                message: 'Parameter value is invalid',
            });
        }

        const isOldUser = await User.find({
            phonenumber: req.body.phonenumber,
        });
        if (isOldUser.length > 0) {
            return res.json({
                code: 9996,
                messgae: 'User existed',
            });
        }

        const dataToken = {
            // username: req.body.username,
            phonenumber: req.body.phonenumber,
            password: req.body.password,
        };
        const token = jwt.sign(dataToken, process.env.ACCESS_TOKEN_KEY, {
            // expiresIn: '1h',
        });
        const newUser = await new User({
            phonenumber: req.body.phonenumber,
            password: req.body.password,
            id: uuidv4(),
            token: token,
            avatar: '',
            username: req.body.username,
            role: req.body.role,
        });
        await newUser.save();
        return res.json({
            code: 1000,
            message: 'OK',
            data: {
                id: newUser.id,
                username: newUser.username,
                token: token,
                active: false,
                avatar: newUser.avatar,
            },
        });
    } catch (err) {
        return res.json({
            code: 9999,
            message: 'Exception error.',
        });
    }
});

module.exports = router;