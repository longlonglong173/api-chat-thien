const express = require('express');
const router = express.Router();
const User = require('../../models/User');
const RequestFriend = require('../../models/RequestFriend');

router.get('/', async(req, res) => {
    res.json('GET SAVED SEARCH API');
});

router.post('/', async(req, res) => {
    try {
        const reqToken = req.body.token;
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
        }).exec();
        if (!user) {
            return res.json({
                code: 9998,
                message: 'Token is invalid.',
            });
        }

        let searchHistoryList = user.search_history.slice().reverse();
        let searchHistoryListSplice = searchHistoryList.splice(
            reqIndex,
            reqCount
        );
        let result = [];
        searchHistoryListSplice.forEach((search) => {
            result.push({
                id: search.id,
                keyword: search.keyword,
                created: search.createdAt,
            });
        });

        res.json({
            code: 1000,
            message: 'OK',
            data: result,
        });
    } catch (error) {
        res.json({
            message: error,
        });
    }
});

module.exports = router;