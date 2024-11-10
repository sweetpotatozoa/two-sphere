import clientPromise from '@/lib/mongodb'; // MongoDB 클라이언트 설정 가져오기
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        // MongoDB 연결
        const client = await clientPromise;
        const db = client.db();

        // 조건에 맞는 모임 데이터 조회
        const spheres = await db
            .collection('spheres')
            .find({ status: 'closed' })
            .project({
                _id: 1,
                title: 1,
                subTitle: 1,
                'location.title': 1,
                thumbnail: 1,
                firstDate: 1,
                secondDate: 1,
            })
            .toArray();

        const currentDate = new Date();

        // 남은 날짜 계산 및 응답 데이터 구성
        const sphereWithRemainingDays = spheres.map((sphere) => {
            const firstDate = new Date(sphere.firstDate);
            const secondDate = new Date(sphere.secondDate);

            let remainingDays;

            if (currentDate < firstDate) {
                // 첫 번째 날짜 이전이면 firstDate와의 남은 날짜를 계산
                remainingDays = Math.floor((firstDate - currentDate) / (1000 * 60 * 60 * 24));
            } else if (currentDate < secondDate) {
                // 두 번째 날짜 이전이면 secondDate와의 남은 날짜를 계산
                remainingDays = Math.floor((secondDate - currentDate) / (1000 * 60 * 60 * 24));
            } else {
                // 두 번째 날짜가 지난 경우 "종료" 표시
                remainingDays = 0;
            }

            return {
                ...sphere,
                location: sphere.location.title,
                time: remainingDays,
            };
        });

        return NextResponse.json(sphereWithRemainingDays, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
