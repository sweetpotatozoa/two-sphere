import clientPromise from '@/lib/mongodb';
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export async function POST(req) {
    try {
        // 요청 본문에서 사용자 정보 가져오기
        const { userName, password } = await req.json();

        if (!userName || !password) {
            return NextResponse.json({ message: 'Username and password are required' }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db();

        // 사용자 찾기
        const user = await db.collection('users').findOne({ userName });
        if (!user) {
            return NextResponse.json({ message: 'Invalid username or password' }, { status: 401 });
        }

        // 비밀번호 검증
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return NextResponse.json({ message: 'Invalid username or password' }, { status: 401 });
        }

        // JWT 토큰 발급
        const token = jwt.sign(
            { user: { id: user._id } }, // 토큰에 담을 정보
            process.env.ACCESS_TOKEN_DEV // .env에 저장된 비밀 키 사용
        );

        // 성공 시 토큰 반환
        return NextResponse.json({ message: 'Login successful', token }, { status: 200 });
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({ message: 'An error occurred during login' }, { status: 500 });
    }
}
