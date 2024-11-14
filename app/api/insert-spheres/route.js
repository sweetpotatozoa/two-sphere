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
                title: '콘텐츠 마케터 Sphere',
                subtitle: '요즘 마케터들은 콘텐츠 뭐 봄?',
                description: '마케터들이 좋은 분위기에서 맛있는 음식을 먹으며 대화를 나누는 시간을 가질 예정입니다.',
                status: 'closed',
                createdAt: new Date(),
                place: { name: '야옹식당', address: '서울특별시 강남구 청담동 123-4' },
                placeStory: `WHAT WE WANT IS A PLACE
        WHERE EVERYONE CAN HANG OUT FREELY
        
        아베크 청담은 18세기 프랑스 살롱 문화를 모티브로 하여
        예술과 프라이빗한 공간이 어우러진 다이닝 카페, 바입니다.
        
        에피타이저부터 디저트까지 다채로운 디시 구성과
        감각적인 인테리어의 공간에서 인사이트를 공유해보세요.`,
                firstDate: new Date('2024-11-13T19:30:00'),
                secondDate: new Date('2024-11-20T19:30:00'),
                questions: [
                    '당신의 최근 관심 콘텐츠는 무엇인가요?',
                    '현재의 주요 업무와 도전 과제는 무엇인가요?',
                    '앞으로의 계획은 무엇인가요?',
                ],
                thumbnail: '/sample-sphere.svg',
                subImage1: '/sample-place-1.svg',
                subImage2: '/sample-place-2.svg',
                participants: [
                    {
                        userId: '123',
                        isLeader: false,
                        requestLeader: true,
                        payment: 'unpaid',
                        attendCount: 0,
                        createdAt: new Date(),
                        cancelInfo: {
                            isCancel: false,
                            account: '',
                            bank: '',
                            reason: '',
                            createdAt: null,
                        },
                    },
                ],
            },
        ];
        // 데이터 삽입
        const result = await db.collection('spheres').insertMany(sampleData);
        console.log(`${result.insertedCount}개의 문서가 삽입되었습니다.`);

        return NextResponse.json({ message: '데이터가 성공적으로 삽입되었습니다.' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
