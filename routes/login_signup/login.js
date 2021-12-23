const express = require('express');
const router = express.Router();
const User = require('../../models/User');
const jwt = require('jsonwebtoken');

// CHECK PHONE NUMBER, PASSWORRD
function check(phonenumber, password) {
    const regexphoneNumber = new RegExp(/^0\d{9}$/);
    const regexPassword = new RegExp(/^[a-zA-Z0-9]{6,10}$/);
    const phonenumberCheck = regexphoneNumber.test(phonenumber);
    const passwordCheck = regexPassword.test(password);
    if (phonenumberCheck && passwordCheck && phonenumber !== password) {
        return true;
    } else {
        return false;
    }
}

// GET ALL POST
router.get('/', async(req, res) => {
    res.json('LOGIN API');
});

router.post('/', async(req, res) => {
    try {
        console.log('OK')
        console.log(req.body);
        let user = '';
        if (req.body.token) {
            user = await User.findOne({
                token: req.body.stoken,
            }).exec();
        } else {
            user = await User.findOne({
                phonenumber: req.body.phonenumber,
                password: req.body.password,
            }).exec();
        }
        if (user) {
            if (user.token === '') {
                let newToken = jwt.sign({
                        phonenumber: req.body.phonenumber,
                        password: req.body.password,
                    },
                    process.env.ACCESS_TOKEN_KEY
                );
                await User.findOneAndUpdate({
                    phonenumber: req.body.phonenumber,
                }, { token: newToken });
            }
            await User.findOneAndUpdate({
                phonenumber: req.body.phonenumber,
            }, { $push: { loginTime: Date.now() } });
            if (req.body.token) {
                user = await User.findOne({
                    token: req.body.token,
                }).exec();
            } else {
                user = await User.findOne({
                    phonenumber: req.body.phonenumber,
                    password: req.body.password,
                }).exec();
            }
            res.json({
                code: 1000,
                message: 'OK',
                data: {
                    id: user.id,
                    username: user.username,
                    token: user.token,
                    avatar: user.avatar,
                },
            });
        } else {
            res.json({
                code: 9995,
                message: 'User Is Not Validated',
                // data: {},
            });
        }
        // }
    } catch (err) {
        res.json({ message: 'ERROR' });
    }
});

module.exports = router;