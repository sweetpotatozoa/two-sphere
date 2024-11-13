import clientPromise from '@/lib/mongodb';
import { NextResponse } from 'next/server';
import coolsms from 'coolsms-node-sdk';

const messageService = new coolsms(process.env.MESSAGE_API_KEY, process.env.MESSAGE_API_SECRET);

export async function POST(req) {
    try {
        const { phoneNumber } = await req.json();

        if (!phoneNumber) {
            return NextResponse.json({ message: 'Phone number is required' }, { status: 400 });
        }

        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

        // SMS 전송
        await messageService.sendOne({
            to: phoneNumber,
            from: process.env.MESSAGE_SENDER,
            text: `인증 코드: ${verificationCode}`,
        });

        // MongoDB에 인증 코드 저장
        const client = await clientPromise;
        const db = client.db();

        // 기존에 동일한 번호로 저장된 인증 코드가 있다면 삭제
        await db.collection('verificationCodes').deleteOne({ phoneNumber });

        // 새로운 인증 코드 저장
        await db.collection('verificationCodes').insertOne({
            phoneNumber,
            code: verificationCode,
            createdAt: new Date(),
        });

        return NextResponse.json({ message: '인증 코드가 발송되었습니다.' }, { status: 200 });
    } catch (error) {
        console.error('Request code error:', error);
        return NextResponse.json({ message: 'An error occurred during code request' }, { status: 500 });
    }
}
