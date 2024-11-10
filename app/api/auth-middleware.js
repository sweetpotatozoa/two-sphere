const jwt = require('jsonwebtoken');
const configs = require('../utils/configs');

const auth = (req, res, next) => {
    // Authorization 헤더에서 토큰 추출
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ status: 4010, msg: 'No token provided' });
    }

    // Bearer 토큰에서 실제 토큰 값 추출
    const token = authHeader.split(' ')[1];

    try {
        // 토큰 검증
        const verified = jwt.verify(token, configs.accessTokenSecret);
        req.user = verified.user; // 유효한 토큰일 경우 사용자 정보 추가
        next(); // 인증 성공 시 다음 핸들러로 진행
    } catch (err) {
        return res.status(401).json({ status: 4011, msg: 'Invalid Token' });
    }
};

module.exports = auth;
