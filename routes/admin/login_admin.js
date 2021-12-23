const express = require('express');
const router = express.Router();
const path = require('path');
const User = require(path.resolve('./models/User'));
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
        if (
            check(req.body.phonenumber, req.body.password) ||
            req.body.token !== ''
        ) {
            let user = '';
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
                    }, { token: newToken }, { $push: { loginTime: Date.now() } });
                    user = await User.findOne({
                        phonenumber: req.body.phonenumber,
                        password: req.body.password,
                    }).exec();
                }
                if (user.role === 'admin') {
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
                        code: 1009,
                        message: 'Not access',
                    });
                }
            } else {
                res.json({
                    code: 9995,
                    message: 'User Is Not Validated',
                });
            }
        } else {
            res.json({
                code: 1004,
                message: 'Parameter value is invalid',
            });
        }
    } catch (err) {
        res.json({ message: 'ERROR' });
    }
});

module.exports = router;