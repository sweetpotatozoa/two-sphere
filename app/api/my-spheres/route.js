import clientPromise from '@/lib/mongodb';
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';

export async function GET(req) {
    try {
        const userId = req.headers.get('x-user-id');
        if (!userId) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const client = await clientPromise;
        const db = client.db();

        // 사용자 참여 정보를 필터링하여 가져옴: `payment`가 `refunded`가 아닌 경우만 포함
        const spheres = await db
            .collection('spheres')
            .find({
                'participants.userId': new ObjectId(userId),
                'participants.payment': { $ne: 'refunded' },
            })
            .toArray();

        if (!spheres || spheres.length === 0) {
            return NextResponse.json({ message: 'No spheres found' }, { status: 404 });
        }

        // 상태에 따른 분류를 위해 스피어 ID를 저장할 배열 생성
        const openSpheres = [];
        const ongoingSpheres = [];
        const closedSpheres = [];

        // 참여자 정보를 포함한 스피어 정보를 구성
        const updatedSpheres = await Promise.all(
            spheres.map(async (sphere) => {
                // 각 sphere에서 요청한 사용자의 `payment` 상태를 확인하여 `isPaid` 설정
                const userParticipant = sphere.participants.find((participant) =>
                    participant.userId.equals(new ObjectId(userId))
                );
                const isUserUnpaid = userParticipant && userParticipant.payment === 'unpaid';
                const isPaid = !isUserUnpaid;

                // 각 sphere의 참여자 ID들을 userId 배열로 수집
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

                // sphere가 closed 상태이거나 요청한 유저의 payment 상태가 unpaid인 경우 name과 image 필드도 제외
                if (sphere.status === 'closed' || isUserUnpaid) {
                    projection = { ...projection, name: 0, image: 0 };
                }

                // 참여자 정보를 users 컬렉션에서 가져오기
                const users = await db
                    .collection('users')
                    .find({ _id: { $in: participantIds } }, { projection })
                    .toArray();

                // 참여자 정보를 매핑하여 추가 (userInfo 필드 없이)
                sphere.participants = sphere.participants.map((participant) => {
                    const userInfo = users.find((user) => user._id.equals(participant.userId)) || {};

                    // _id 대신 userId를 유지하고 _id는 제거하여 중복 방지
                    const { _id, ...userInfoWithoutId } = userInfo;

                    return {
                        ...participant,
                        ...userInfoWithoutId, // userInfo의 각 필드를 직접 participants 객체에 병합
                    };
                });

                // `isPaid` 필드를 sphere에 추가
                sphere.isPaid = isPaid;

                // 스피어 상태에 따라 분류
                if (sphere.status === 'open') {
                    openSpheres.push(sphere);
                } else if (sphere.status === 'ongoing') {
                    ongoingSpheres.push(sphere);
                } else if (sphere.status === 'closed') {
                    closedSpheres.push(sphere);
                }

                return sphere;
            })
        );

        return NextResponse.json({ openSpheres, ongoingSpheres, closedSpheres }, { status: 200 });
    } catch (error) {
        console.error('Get user info error:', error);
        return NextResponse.json({ message: 'An error occurred while fetching sphere info' }, { status: 500 });
    }
}
