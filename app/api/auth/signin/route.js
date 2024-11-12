import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import clientPromise from '../../../../lib/mongodb';
import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        const { userName, password } = await req.json();

        // 요청 데이터 확인
        if (!userName || !password) {
            return NextResponse.json({ message: '아이디와 비밀번호를 입력해주세요.' }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db('development'); // 데이터베이스 이름 확인
        const user = await db.collection('users').findOne({ userName });

        // 유저 확인
        if (!user) {
            return NextResponse.json({ message: '존재하지 않는 사용자입니다.' }, { status: 401 });
        }

        // 비밀번호 검증
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return NextResponse.json({ message: '비밀번호가 올바르지 않습니다.' }, { status: 401 });
        }

        // JWT 토큰 생성
        const token = jwt.sign(
            { user: { id: user._id } }, // 토큰에 담을 정보
            process.env.ACCESS_TOKEN_DEV // ACCESS_TOKEN_DEV를 비밀 키로 사용
        );

        // 성공 응답
        return NextResponse.json({ token }, { status: 200 });
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({ message: '로그인 처리 중 오류가 발생했습니다.' }, { status: 500 });
    }
}
