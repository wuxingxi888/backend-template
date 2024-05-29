const jwt = require('jsonwebtoken');

const expiresIn = 60 * 60 * 24; // token过期时间

const secretKey = 'qazwsxedc'; // 替换为你的密钥

const whitelist = ['/api/user/login', '']; // 定义白名单

module.exports = {

    // 生成JWT
    generateToken(payload) {
        return jwt.sign(payload, secretKey, { expiresIn });
    },

    // 验证JWT
    verifyToken(token) {
        try {
            return jwt.verify(token, secretKey);
        } catch (error) {
            return null; // 验证失败，返回null
        }
    },

    // 验证路由是否在白名单中
    isRouteInWhitelist(route) {
        return whitelist.includes(route);
    }
};
