import clientPromise from '@/lib/mongodb';
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';

export async function POST(req) {
    try {
        // 요청 본문을 JSON 형식으로 파싱
        const { name, birthDate, sex, jobStatus, userName, password, phoneNumber } = await req.json();

        // 필수 필드 유효성 검사
        if (!name || !birthDate || !sex || !jobStatus || !userName || !password || !phoneNumber) {
            return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db();

        // 비밀번호 해싱
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // 사용자 데이터 생성
        const newUser = {
            name,
            birthDate: new Date(birthDate), // 날짜로 변환하여 저장
            sex,
            jobStatus,
            userName,
            password: hashedPassword, // 해싱된 비밀번호 저장
            phoneNumber,
            createdAt: new Date(),
            updatedAt: new Date(),
            isProfiled: false,
            career: '',
            answers: {
                career: '',
                keyword: '',
                focus: '',
                dream: '',
                reputation: '',
            },
            image: '',
        };

        // MongoDB에 사용자 데이터 저장
        await db.collection('users').insertOne(newUser);

        return NextResponse.json({ message: 'User registered successfully' }, { status: 201 });
    } catch (error) {
        console.error('Signup error:', error);
        return NextResponse.json({ message: 'An error occurred during signup' }, { status: 500 });
    }
}
