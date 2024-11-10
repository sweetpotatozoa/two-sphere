// app/api/check-username/route.js

import clientPromise from '@/lib/mongodb';
import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        // 클라이언트에서 보내는 JSON 데이터에서 `username` 추출
        const { userName } = await req.json();

        // 유효성 검사
        if (!userName) {
            return NextResponse.json({ message: 'Username is required' }, { status: 400 });
        }

        // MongoDB 연결
        const client = await clientPromise;
        const db = client.db();

        // 데이터베이스에서 동일한 `username`이 있는지 확인
        const existingUser = await db.collection('users').findOne({ userName });

        if (existingUser) {
            // 중복된 아이디가 있는 경우
            return NextResponse.json({ message: 'Username is already taken' }, { status: 409 });
        }

        // 중복된 아이디가 없는 경우
        return NextResponse.json({ message: 'Username is available' }, { status: 200 });
    } catch (error) {
        console.error('Check username error:', error);
        return NextResponse.json({ message: 'An error occurred during username check' }, { status: 500 });
    }
}
