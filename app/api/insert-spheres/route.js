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
                title: '식당1',
                subTitle: '개쩌는 스타트업 대표들의 모임',
                content: '좋은 분위기에서 맛있는 음식을 먹으며 대화를 나누는 시간을 가질 예정입니다.',
                status: 'closed',
                createdAt: new Date(),
                location: { title: '야옹식당', address: '서울특별시 강남구 청담동 123-4' },
                firstDate: new Date('2024-11-13T19:30:00'),
                secondDate: new Date('2024-11-20T19:30:00'),
                subjects: [
                    '당신의 최근 관심 콘텐츠는 무엇인가요?',
                    '현재의 주요 업무와 도전 과제는 무엇인가요?',
                    '앞으로의 계획은 무엇인가요?',
                ],
                thumbnail:
                    'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/17/3b/51/14/205-largejpg.jpg?w=1200&h=-1&s=1',
                subImage1: 'https://www.palnews.co.kr/news/photo/201801/92969_25283_5321.jpg',
                subImage2:
                    'https://flexible.img.hani.co.kr/flexible/normal/970/582/imgdb/child/2024/0903/53_17253380473588_20240903501638.jpg',
                participants: [
                    {
                        userId: '123',
                        isHost: true,
                        payment: 'paid',
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
                    {
                        userId: '123',
                        isHost: false,
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
            {
                title: '식당2',
                subTitle: '개쩌는 마케터들의 모임',
                content: '좋은 분위기에서 맛있는 음식을 먹으며 대화를 나누는 시간을 가질 예정입니다.',
                status: 'open',
                createdAt: new Date(),
                location: { title: '멍멍식당', address: '서울특별시 성북구 보문동 123-4' },
                firstDate: new Date('2024-11-13T19:30:00'),
                secondDate: new Date('2024-11-20T19:30:00'),
                subjects: [
                    '당신의 최근 관심 콘텐츠는 무엇인가요?',
                    '현재의 주요 업무와 도전 과제는 무엇인가요?',
                    '앞으로의 계획은 무엇인가요?',
                ],
                thumbnail: 'https://cdn.sukbakmagazine.com/news/photo/201910/51105_402236_1336.jpg',
                subImage1: 'https://cdn.hellodd.com/news/photo/202005/71835_craw1.jpg',
                subImage2:
                    'https://pds.joongang.co.kr/news/component/htmlphoto_mmdata/202203/25/2bb2f134-1dba-4bc7-b5fe-cad55781b023.jpg',
                participants: [
                    {
                        userId: '123',
                        isHost: true,
                        payment: 'paid',
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
                    {
                        userId: '123',
                        isHost: false,
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
