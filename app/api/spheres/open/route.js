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

            // 날짜만 비교하기 위해 현재 날짜와 기준 날짜를 "연-월-일"로 변환
            const currentDateOnly = new Date(currentDate.toDateString());
            const firstDateOnly = new Date(firstDate.toDateString());
            const secondDateOnly = new Date(secondDate.toDateString());

            // "월 일" 형식으로 날짜 변환 (항상 한국 시간대 적용)
            const formatToMonthDay = (date) => {
                const formattedDate = date.toLocaleDateString('ko-KR', {
                    month: 'numeric',
                    day: 'numeric',
                    timeZone: 'Asia/Seoul',
                });
                return formattedDate.replace('.', '월 ').replace('.', '일'); // 월과 일 추가
            };

            const formattedFirstDate = formatToMonthDay(firstDate);
            const formattedSecondDate = formatToMonthDay(secondDate);

            // "오전/오후 ~시" 형식으로 시간 변환 (항상 한국 시간대 적용)
            const formatToHourMinute = (date) => {
                return date.toLocaleTimeString('ko-KR', {
                    hour: 'numeric',
                    minute: 'numeric',
                    hour12: true,
                    timeZone: 'Asia/Seoul',
                });
            };

            // 남은 날짜 계산
            let remainingDays;
            if (currentDateOnly.getTime() === firstDateOnly.getTime()) {
                // 첫 번째 날짜와 같은 날이면 0
                remainingDays = 0;
            } else if (currentDateOnly.getTime() === secondDateOnly.getTime()) {
                // 두 번째 날짜와 같은 날이면 0
                remainingDays = 0;
            } else if (currentDateOnly < firstDateOnly) {
                // 첫 번째 날짜 이전이면 남은 날짜 계산
                remainingDays = Math.ceil((firstDateOnly - currentDateOnly) / (1000 * 60 * 60 * 24));
            } else if (currentDateOnly < secondDateOnly) {
                // 두 번째 날짜 이전이면 남은 날짜 계산
                remainingDays = Math.ceil((secondDateOnly - currentDateOnly) / (1000 * 60 * 60 * 24));
            } else {
                // 두 날짜 모두 지난 경우
                remainingDays = -1;
            }

            return {
                ...sphere,
                placeName: sphere.place.name,
                firstDate: formattedFirstDate,
                secondDate: formattedSecondDate,
                time: formatToHourMinute(firstDate),
                remainingDays,
            };
        });

        return NextResponse.json(sphereWithRemainingDays, { status: 200 });
    } catch (error) {
        console.error('Error in fetching open spheres:', error);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
