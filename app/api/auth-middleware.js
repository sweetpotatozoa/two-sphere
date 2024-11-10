import jwt from 'jsonwebtoken';

export function authMiddleware(handler) {
    return async (req, res) => {
        const authHeader = req.headers['authorization'];

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ status: 4010, msg: 'No token provided' });
        }

        const token = authHeader.split(' ')[1];

        try {
            const verified = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
            req.user = verified.user; // 유효한 토큰일 경우 사용자 정보 추가

            // 인증 성공 시 handler로 요청 전달
            return handler(req, res);
        } catch (err) {
            return res.status(401).json({ status: 4011, msg: 'Invalid Token' });
        }
    };
}
