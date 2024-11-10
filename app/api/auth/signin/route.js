// app/api/auth/signin/route.js

import clientPromise from '../../../../lib/mongodb';
import jwt from 'jsonwebtoken';

export async function POST(req) {
    try {
        const { username, password } = await req.json(); // 요청으로부터 username과 password 추출

        // MongoDB에 연결하고, users 컬렉션에서 유저 찾기
        const client = await clientPromise;
        const db = client.db('development');
        const user = await db.collection('users').findOne({ username });

        if (!user || user.password !== password) {
            return new Response(JSON.stringify({ message: '아이디 또는 비밀번호가 잘못되었습니다.' }), {
                status: 401,
            });
        }

        // 유저가 있을 경우 JWT 토큰 생성
        const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '1h' });

        return new Response(JSON.stringify({ token }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Login error:', error);
        return new Response(JSON.stringify({ message: '로그인 처리 중 오류가 발생했습니다.' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
