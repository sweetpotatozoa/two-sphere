// app/api/my-spheres/route.js

import clientPromise from '@/lib/mongodb';
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';

export async function GET(req) {
    try {
        const userId = req.headers.get('x-user-id');
        console.log('UserId from header:', userId);

        if (!userId || !ObjectId.isValid(userId)) {
            return NextResponse.json({ message: 'Unauthorized or invalid user ID format' }, { status: 401 });
        }

        const client = await clientPromise;
        const db = client.db();

        const spheres = await db
            .collection('spheres')
            .find({
                participants: {
                    $elemMatch: {
                        userId: new ObjectId(userId), // 주어진 userId와 일치하는 참여자 찾기
                        'cancelInfo.isCancel': false,
                    },
                },
            })
            .toArray();

        console.log('Fetched spheres:', spheres);

        if (!spheres || spheres.length === 0) {
            // 스피어가 없는 유저에 대한 메시지 반환
            return NextResponse.json(
                {
                    message: '아직 참여 신청한 스피어가 없습니다.',
                    openSpheres: [],
                    ongoingSpheres: [],
                    closedSpheres: [],
                },
                { status: 200 }
            );
        }

        const openSpheres = [];
        const ongoingSpheres = [];
        const closedSpheres = [];

        // 한국 시간대로 월, 일 형식 변환
        const formatToMonthDay = (date) => {
            return date
                .toLocaleDateString('ko-KR', {
                    month: 'numeric',
                    day: 'numeric',
                    timeZone: 'Asia/Seoul',
                })
                .replace('.', '월 ')
                .replace('.', '일'); // 월과 일 추가
        };

        // 한국 시간대로 오전/오후 ~시 형식 변환
        const formatToHour = (date) => {
            return date.toLocaleTimeString('ko-KR', {
                hour: 'numeric',
                hour12: true,
                timeZone: 'Asia/Seoul',
            });
        };

        await Promise.all(
            spheres.map(async (sphere) => {
                const userParticipant = sphere.participants.find((participant) => {
                    const participantUserId = ObjectId.isValid(participant.userId)
                        ? new ObjectId(participant.userId)
                        : null;
                    return participantUserId && participantUserId.equals(new ObjectId(userId));
                });

                const canNotViewNamesAndImages =
                    !userParticipant || userParticipant.payment === 'unpaid' || sphere.status === 'closed';
                sphere.canNotViewNamesAndImages = canNotViewNamesAndImages;
                sphere.hasUnpaidStatus =
                    userParticipant && userParticipant.payment === 'unpaid' && sphere.status === 'open';

                const participantIds = sphere.participants
                    .map((participant) =>
                        ObjectId.isValid(participant.userId) ? new ObjectId(participant.userId) : null
                    )
                    .filter(Boolean);

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

                const users = await db
                    .collection('users')
                    .find({ _id: { $in: participantIds } }, { projection })
                    .toArray();

                sphere.participants = sphere.participants.map((participant) => {
                    const participantUserId = ObjectId.isValid(participant.userId)
                        ? new ObjectId(participant.userId)
                        : null;
                    const userInfo = users.find((user) => user._id.equals(participantUserId)) || {};
                    const { _id, ...userInfoWithoutId } = userInfo;
                    return { ...participant, ...userInfoWithoutId };
                });

                // 한국 시간대 기준으로 날짜와 시간 형식 설정
                sphere.time = formatToHour(new Date(sphere.firstDate));
                sphere.firstDate = formatToMonthDay(new Date(sphere.firstDate));
                sphere.secondDate = formatToMonthDay(new Date(sphere.secondDate));

                if (sphere.status === 'open') openSpheres.push(sphere);
                else if (sphere.status === 'ongoing') ongoingSpheres.push(sphere);
                else if (sphere.status === 'closed') closedSpheres.push(sphere);

                return sphere;
            })
        );

        return NextResponse.json({ openSpheres, ongoingSpheres, closedSpheres }, { status: 200 });
    } catch (error) {
        console.error('Error fetching user spheres:', error);
        return NextResponse.json({ message: 'An error occurred while fetching sphere info' }, { status: 500 });
    }
}
