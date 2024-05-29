var express = require('express');
const User = require("../models/user");
const utils = require("../common/utils");
const {generateToken} = require("../common/jwt");
const errorCode = require("../common/errorCode");
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});

router.post('/login', async function (req, res, next) {
    try {
        let user = await User.findOne({
            where: req.body,
        });

        if (!user) {
            utils.SendError(res, errorCode.error_credential);
            return;
        }

        const token = await generateToken({username: user.username, id: user.id});

        await User.update({token: token}, {where: {id: user.id}});

        utils.SendResult(res, {token});
    } catch (error) {
        console.log(error);
        utils.SendError(res, error);
    }
});

// 获取用户信息
router.get('/info', async function (req, res, next) {

});

module.exports = router;
