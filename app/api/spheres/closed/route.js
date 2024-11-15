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
                subtitle: 1,
                'place.name': 1,
                thumbnail: 1,
                firstDate: 1,
                secondDate: 1,
            })
            .toArray();

        const currentDate = new Date();

        // 한국 시간대로 날짜 변환 함수
        const toKoreanDateOnly = (date) => {
            const dateString = date.toLocaleDateString('en-US', { timeZone: 'Asia/Seoul' });
            return new Date(dateString); // "연-월-일" 형태의 순수 날짜 객체 반환
        };

        // "월 일" 형식으로 날짜 변환 함수
        const formatToMonthDay = (date) => {
            const formattedDate = date.toLocaleDateString('ko-KR', {
                month: 'numeric',
                day: 'numeric',
                timeZone: 'Asia/Seoul',
            });
            return formattedDate.replace('.', '월 ').replace('.', '일'); // 월과 일 추가
        };

        // "오전/오후 ~시" 형식으로 시간 변환 함수
        const formatToHour = (date) => {
            return date.toLocaleTimeString('ko-KR', {
                hour: 'numeric',
                hour12: true,
                timeZone: 'Asia/Seoul',
            });
        };

        // 남은 날짜 계산 함수
        const calculateRemainingDays = (currentDate, firstDate, secondDate) => {
            // 모든 날짜를 한국 시간대로 변환
            const koreanCurrentDate = toKoreanDateOnly(currentDate);
            const koreanFirstDate = toKoreanDateOnly(firstDate);
            const koreanSecondDate = toKoreanDateOnly(secondDate);

            let remainingDays;

            if (koreanCurrentDate.getTime() === koreanFirstDate.getTime()) {
                // 첫 번째 날짜와 같은 날이면 0
                remainingDays = 0;
            } else if (koreanCurrentDate.getTime() === koreanSecondDate.getTime()) {
                // 두 번째 날짜와 같은 날이면 0
                remainingDays = 0;
            } else if (koreanCurrentDate < koreanFirstDate) {
                // 첫 번째 날짜 이전이면 남은 날짜 계산
                remainingDays = Math.ceil((koreanFirstDate - koreanCurrentDate) / (1000 * 60 * 60 * 24));
            } else if (koreanCurrentDate < koreanSecondDate) {
                // 두 번째 날짜 이전이면 남은 날짜 계산
                remainingDays = Math.ceil((koreanSecondDate - koreanCurrentDate) / (1000 * 60 * 60 * 24));
            } else {
                // 두 날짜 모두 지난 경우
                remainingDays = -1;
            }

            return remainingDays;
        };

        // 응답 데이터 구성
        const sphereWithRemainingDays = spheres.map((sphere) => {
            const firstDate = new Date(sphere.firstDate);
            const secondDate = new Date(sphere.secondDate);

            const remainingDays = calculateRemainingDays(currentDate, firstDate, secondDate);

            return {
                ...sphere,
                placeName: sphere.place.name,
                firstDate: formatToMonthDay(firstDate),
                secondDate: formatToMonthDay(secondDate),
                time: formatToHour(firstDate),
                remainingDays,
            };
        });

        return NextResponse.json(sphereWithRemainingDays, { status: 200 });
    } catch (error) {
        console.error('Error fetching closed spheres:', error);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
