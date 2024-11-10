// app/api/auth/user/route.js

import clientPromise from '@/lib/mongodb';
import jwt from 'jsonwebtoken';

export async function GET(req) {
    const authorizationHeader = req.headers.get('authorization');
    const token = authorizationHeader?.split(' ')[1]; // 'Bearer <token>'에서 토큰 부분만 추출

    if (!token) {
        return new Response(JSON.stringify({ message: 'Unauthorized: No token provided' }), { status: 401 });
    }

    try {
        // JWT 토큰 검증
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // MongoDB에서 사용자 정보 가져오기
        const client = await clientPromise;
        const db = client.db(process.env.DB_NAME_DEV);
        const user = await db.collection('users').findOne({ username: decoded.username });

        if (!user) {
            return new Response(JSON.stringify({ message: 'User not found' }), { status: 404 });
        }

        // 사용자 정보 응답 (예: 이름과 이메일)
        return new Response(
            JSON.stringify({
                name: user.name,
                email: user.email,
                answers: user.answers,
                jobStatus: user.jobStatus,
                career: user.career,
            }),
            { status: 200 }
        );
    } catch (error) {
        console.error('Error verifying token or fetching user:', error);
        return new Response(JSON.stringify({ message: 'Invalid or expired token' }), { status: 403 });
    }
}
