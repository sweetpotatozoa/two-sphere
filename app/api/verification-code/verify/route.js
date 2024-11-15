// app/api/verification-code/verify/route.js

import clientPromise from '@/lib/mongodb';
import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        const { phoneNumber, code } = await req.json();

        // 요청 필드 확인
        if (!phoneNumber || !code) {
            return NextResponse.json({ message: 'Phone number and code are required' }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db();

        // MongoDB에서 해당 번호의 인증 코드 조회
        const record = await db.collection('verificationCodes').findOne({ phoneNumber });

        // 인증번호 검증
        if (!record || record.code !== code) {
            return NextResponse.json({ message: 'Invalid or expired code' }, { status: 401 });
        }

        // 인증 코드 삭제 (사용 후)
        await db.collection('verificationCodes').deleteOne({ phoneNumber });

        return NextResponse.json({ message: 'Verification successful' }, { status: 200 });
    } catch (error) {
        console.error('Verify code error:', error);
        return NextResponse.json({ message: 'An error occurred during verification' }, { status: 500 });
    }
}
