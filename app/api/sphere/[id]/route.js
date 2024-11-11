import clientPromise from '@/lib/mongodb';
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';

export async function GET(req, { params }) {
    try {
        const { id } = params;
        const userId = req.headers.get('x-user-id'); // 요청한 유저의 ID 가져오기

        const client = await clientPromise;
        const db = client.db();

        // sphere 정보 가져오기
        const sphere = await db.collection('spheres').findOne(
            { _id: new ObjectId(id) },
            {
                projection: {
                    _id: 1,
                    title: 1,
                    content: 1,
                    location: 1,
                    thumbnail: 1,
                    firstDate: 1,
                    secondDate: 1,
                    subImage1: 1,
                    subImage2: 1,
                    subjects: 1,
                    participants: 1,
                    status: 1,
                },
            }
        );

        if (!sphere) {
            return NextResponse.json({ message: 'Sphere not found' }, { status: 404 });
        }

        // 요청한 사용자의 `payment` 상태 확인
        const userParticipant = userId
            ? sphere.participants.find((participant) => participant.userId.equals(new ObjectId(userId)))
            : null;
        const isUserUnpaid = !userId || !userParticipant || userParticipant.payment === 'unpaid';

        // 요청한 유저가 참여자이지만 `unpaid` 상태인 경우 `isUnpaid`를 true로 설정
        sphere.isUnpaid = userParticipant && userParticipant.payment === 'unpaid';

        // `cancelInfo.isCancel`이 `true`인 참여자 필터링
        sphere.participants = sphere.participants.filter((participant) => !participant.cancelInfo?.isCancel);

        // 필터링된 참여자 ID 배열 생성
        const participantIds = sphere.participants
            .filter((participant) => participant.payment !== 'refunded')
            .map((participant) => participant.userId);

        // 기본적으로 제외할 필드 설정
        let projection = {
            createdAt: 0,
            updatedAt: 0,
            isProfiled: 0,
            phoneNumber: 0,
            password: 0,
            userName: 0,
        };

        // sphere가 closed 상태이거나 요청한 유저의 payment 상태가 unpaid이거나 비로그인 시 name과 image 필드도 제외
        if (sphere.status === 'closed' || isUserUnpaid) {
            projection = { ...projection, name: 0, image: 0 };
        }

        // 참여자 정보를 users 컬렉션에서 가져오기
        const users = await db
            .collection('users')
            .find({ _id: { $in: participantIds } }, { projection })
            .toArray();

        // 참여자 정보를 매핑하여 추가 (userInfo 필드 없이 직접 포함)
        sphere.participants = sphere.participants.map((participant) => {
            const userInfo = users.find((user) => user._id.equals(participant.userId)) || {};

            // _id 대신 userId를 유지하고 _id는 제거하여 중복 방지
            const { _id, ...userInfoWithoutId } = userInfo;

            return {
                ...participant,
                ...userInfoWithoutId, // userInfo의 각 필드를 직접 participants 객체에 병합
            };
        });

        // 날짜 및 시간 포맷 처리
        const formatToMonthDay = (date) => `${date.getMonth() + 1}월 ${date.getDate()}일`;
        const formatToHour = (date) => {
            const hours = date.getHours();
            const period = hours >= 12 ? '오후' : '오전';
            const hour12 = hours % 12 || 12; // 0시는 12로 표시
            return `${period} ${hour12}시`;
        };

        const formattedSphere = {
            ...sphere,
            firstDate: formatToMonthDay(new Date(sphere.firstDate)),
            secondDate: formatToMonthDay(new Date(sphere.secondDate)),
            time: formatToHour(new Date(sphere.firstDate)),
        };

        return NextResponse.json(formattedSphere, { status: 200 });
    } catch (error) {
        console.error('Get sphere info error:', error);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
