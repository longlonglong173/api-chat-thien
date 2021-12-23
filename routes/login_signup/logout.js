const express = require('express');
const router = express.Router();
const User = require('../../models/User');
const jwt = require('jsonwebtoken');

router.get('/', (req, res) => {
    res.json('logout api');
});

router.post('/', async(req, res) => {
    try {
        const user = await User.findOne({
            token: req.body.token,
        }).exec();
        await User.findOneAndUpdate({ token: req.body.token }, { token: '' });
        res.json({
            code: 1000,
            message: 'OK',
        });
    } catch (err) {
        res.json({ message: 'ERROR' });
    }
});

module.exports = router;