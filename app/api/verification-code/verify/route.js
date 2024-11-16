// app/api/verification-code/verify/route.js

import clientPromise from '@/lib/mongodb';
import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        const { phoneNumber, code } = await req.json();

        // 요청 필드 확인
        if (!phoneNumber) {
            return NextResponse.json({ message: '전화번호 입력 후 인증번호를 요청해 주세요.' }, { status: 400 });
        }

        // 요청 필드 확인
        if (!code) {
            return NextResponse.json({ message: '인증번호 요청 후 인증번호를 입력해 주세요.' }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db();

        // MongoDB에서 해당 번호의 인증 코드 조회
        const record = await db.collection('verificationCodes').findOne({ phoneNumber });

        // 인증번호 검증
        if (!record || record.code !== code) {
            return NextResponse.json(
                { message: '인증에 실패했습니다. 다시 인증번호를 요청해 주세요.' },
                { status: 401 }
            );
        }

        // 인증 코드 삭제 (사용 후)
        await db.collection('verificationCodes').deleteOne({ phoneNumber });

        return NextResponse.json({ message: '인증에 성공했습니다.' }, { status: 200 });
    } catch (error) {
        console.error('Verify code error:', error);
        return NextResponse.json({ message: '인증에 실패했습니다.' }, { status: 500 });
    }
}
