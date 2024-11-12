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

        //유저가 취소하지 않은 스피어 찾기
        const spheres = await db
            .collection('spheres')
            .find({
                participants: {
                    $elemMatch: {
                        userId: new ObjectId(userId),
                        'cancelInfo.isCancel': false,
                    },
                },
            })
            .toArray();

        console.log('spheres:', spheres);

        if (!spheres || spheres.length === 0) {
            return NextResponse.json({ message: 'No spheres found' }, { status: 404 });
        }

        // 상태별 분류 배열 초기화
        const openSpheres = [];
        const ongoingSpheres = [];
        const closedSpheres = [];

        await Promise.all(
            spheres.map(async (sphere) => {
                const userParticipant = sphere.participants.find((participant) =>
                    participant.userId.equals(new ObjectId(userId))
                );

                // 이름과 이미지를 볼 수 있는지 여부 판단
                const canNotViewNamesAndImages =
                    !userParticipant || userParticipant.payment === 'unpaid' || sphere.status === 'closed';
                sphere.canNotViewNamesAndImages = canNotViewNamesAndImages;

                // 결제 상태 필드 추가
                sphere.hasUnpaidStatus =
                    userParticipant && userParticipant.payment === 'unpaid' && sphere.status === 'open';

                // 필터링된 참여자 IDs
                const participantIds = sphere.participants.map((participant) => participant.userId);

                // 기본적으로 제외할 필드 설정
                let projection = {
                    createdAt: 0,
                    updatedAt: 0,
                    isProfiled: 0,
                    phoneNumber: 0,
                    password: 0,
                    userName: 0,
                };

                if (canNotViewNamesAndImages) {
                    projection = { ...projection, name: 0, image: 0 };
                }

                // 참여자 정보 가져오기
                const users = await db
                    .collection('users')
                    .find({ _id: { $in: participantIds } }, { projection })
                    .toArray();

                // 참여자 정보를 병합
                sphere.participants = sphere.participants.map((participant) => {
                    const userInfo = users.find((user) => user._id.equals(participant.userId)) || {};
                    const { _id, ...userInfoWithoutId } = userInfo;
                    return { ...participant, ...userInfoWithoutId };
                });

                // 날짜 포맷 함수
                const formatToMonthDay = (date) => `${date.getMonth() + 1}월 ${date.getDate()}일`;
                const formatToHour = (date) => {
                    const hours = date.getHours();
                    const period = hours >= 12 ? '오후' : '오전';
                    const hour12 = hours % 12 || 12;
                    return `${period} ${hour12}시`;
                };

                // 날짜 포맷 적용
                sphere.firstDate = formatToMonthDay(new Date(sphere.firstDate));
                sphere.secondDate = formatToMonthDay(new Date(sphere.secondDate));
                sphere.time = formatToHour(new Date(sphere.firstDate));

                // 스피어 상태에 따라 분류
                if (sphere.status === 'open') openSpheres.push(sphere);
                else if (sphere.status === 'ongoing') ongoingSpheres.push(sphere);
                else if (sphere.status === 'closed') closedSpheres.push(sphere);

                return sphere;
            })
        );

        return NextResponse.json({ openSpheres, ongoingSpheres, closedSpheres }, { status: 200 });
    } catch (error) {
        console.error('Get user info error:', error);
        return NextResponse.json({ message: 'An error occurred while fetching sphere info' }, { status: 500 });
    }
}
