import clientPromise from '@/lib/mongodb';
import { NextResponse } from 'next/server';

export async function POST() {
    try {
        // MongoDB 연결
        const client = await clientPromise;
        const db = client.db();

        // 임시 데이터
        const sampleData = [
            {
                userName: 'admin',
                password: 123,
                name: '관리자',
                birthDate: new Date('1990-01-01'),
                sex: '남성',
                jobStatus: '학생',
                phoneNumber: '01012345678',
                image: 'https://magazine.beattitude.kr/wp-content/uploads/2024/01/13_%EC%97%B0%EC%97%AC%EC%9D%B8YeonYeoin_A-man-scaled.jpg',
                isProfiled: true,
                createdAt: new Date(),
                updatedAt: new Date(),
                career: '서울대학교 컴퓨터공학과',
                job: '',
                answers: {
                    career: '일개 학생',
                    keyword: '개발, 디자인, 마케팅',
                    focus: '유저 중심의 서비스 개발',
                    dream: '세계정복',
                    reputation: '경외의 대상',
                },
            },
        ];

        // 데이터 삽입
        const result = await db.collection('users').insertMany(sampleData);
        console.log(`${result.insertedCount}개의 문서가 삽입되었습니다.`);

        return NextResponse.json({ message: '데이터가 성공적으로 삽입되었습니다.' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
