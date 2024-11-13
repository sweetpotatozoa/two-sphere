import clientPromise from '@/lib/mongodb';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const client = await clientPromise;
        const db = client.db();

        // 상태가 open 또는 ongoing인 스피어만 조회
        const spheres = await db
            .collection('spheres')
            .find({ status: { $in: ['open', 'ongoing'] } })
            .project({
                _id: 1,
                title: 1,
                subtitle: 1,
                'place.name': 1, // location이 객체로 되어 있어야 함
                thumbnail: 1,
                firstDate: 1,
                secondDate: 1,
            })
            .toArray();

        const currentDate = new Date();

        // 남은 날짜 계산 및 데이터 포맷
        const sphereWithRemainingDays = spheres.map((sphere) => {
            const firstDate = new Date(sphere.firstDate);
            const secondDate = new Date(sphere.secondDate);

            // 한국 시간으로 변환 함수
            const toKoreanTime = (date) => new Date(date.getTime() + 9 * 60 * 60 * 1000);

            // "월 일" 형식으로 변환
            const formatToMonthDay = (date) => `${date.getMonth() + 1}월 ${date.getDate()}일`;

            const formattedFirstDate = formatToMonthDay(toKoreanTime(firstDate));
            const formattedSecondDate = formatToMonthDay(toKoreanTime(secondDate));

            // "오전/오후 ~시" 형식으로 시간 변환
            const formatToHour = (date) => {
                const hours = date.getHours();
                const period = hours >= 12 ? '오후' : '오전';
                const hour12 = hours % 12 || 12;
                return `${period} ${hour12}시`;
            };

            let remainingDays;
            if (currentDate < firstDate) {
                remainingDays = Math.ceil((firstDate - currentDate) / (1000 * 60 * 60 * 24));
            } else if (currentDate < secondDate) {
                remainingDays = Math.ceil((secondDate - currentDate) / (1000 * 60 * 60 * 24));
            } else {
                remainingDays = -1; // 두 날짜 모두 지난 경우
            }

            return {
                ...sphere,
                placeName: sphere.place.name,
                firstDate: formattedFirstDate,
                secondDate: formattedSecondDate,
                time: formatToHour(toKoreanTime(firstDate)),
                remainingDays,
            };
        });

        return NextResponse.json(sphereWithRemainingDays, { status: 200 });
    } catch (error) {
        console.error('Error in fetching open spheres:', error);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
