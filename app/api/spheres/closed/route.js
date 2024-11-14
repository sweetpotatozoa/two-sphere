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

        // 남은 날짜 계산 및 응답 데이터 구성
        const sphereWithRemainingDays = spheres.map((sphere) => {
            const firstDate = new Date(sphere.firstDate);
            const secondDate = new Date(sphere.secondDate);

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
            const formatToHour = (date) => {
                return date.toLocaleTimeString('ko-KR', {
                    hour: 'numeric',
                    hour12: true,
                    timeZone: 'Asia/Seoul',
                });
            };

            let remainingDays;

            // 한국 시간대로 Date 객체 변환 함수
            const toKoreanDate = (date) => {
                const koreanDateString = date.toLocaleDateString('en-US', { timeZone: 'Asia/Seoul' });
                return new Date(koreanDateString); // 한국 시간대의 날짜로 변환된 Date 객체 반환
            };

            // 남은 날짜 계산 함수 (한국 시간대 기준)
            const calculateRemainingDays = (currentDate, firstDate, secondDate) => {
                // 모든 날짜를 한국 시간대의 날짜로 변환
                const koreanCurrentDate = toKoreanDate(currentDate);
                const koreanFirstDate = toKoreanDate(firstDate);
                const koreanSecondDate = toKoreanDate(secondDate);

                let remainingDays;
                if (koreanCurrentDate < koreanFirstDate) {
                    remainingDays = Math.ceil((koreanFirstDate - koreanCurrentDate) / (1000 * 60 * 60 * 24));
                } else if (koreanCurrentDate < koreanSecondDate) {
                    remainingDays = Math.ceil((koreanSecondDate - koreanCurrentDate) / (1000 * 60 * 60 * 24));
                } else {
                    remainingDays = -1; // 두 날짜 모두 지난 경우
                }
                return remainingDays;
            };

            remainingDays = calculateRemainingDays(currentDate, firstDate, secondDate);

            return {
                ...sphere,
                placeName: sphere.place.name,
                firstDate: formattedFirstDate,
                secondDate: formattedSecondDate,
                time: formatToHour(firstDate),
                remainingDays,
            };
        });

        return NextResponse.json(sphereWithRemainingDays, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
