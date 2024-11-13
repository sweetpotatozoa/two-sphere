import clientPromise from '@/lib/mongodb';
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';

export async function GET(req) {
    try {
        const userId = req.headers.get('x-user-id');
        if (!userId) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }
        if (!ObjectId.isValid(userId)) {
            return NextResponse.json({ message: 'Invalid user ID format' }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db();

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

        if (!spheres || spheres.length === 0) {
            return NextResponse.json({ message: 'No spheres found' }, { status: 404 });
        }

        const openSpheres = [];
        const ongoingSpheres = [];
        const closedSpheres = [];

        await Promise.all(
            spheres.map(async (sphere) => {
                const userParticipant = sphere.participants.find((participant) =>
                    participant.userId.equals(new ObjectId(userId))
                );

                const canNotViewNamesAndImages =
                    !userParticipant || userParticipant.payment === 'unpaid' || sphere.status === 'closed';
                sphere.canNotViewNamesAndImages = canNotViewNamesAndImages;
                sphere.hasUnpaidStatus =
                    userParticipant && userParticipant.payment === 'unpaid' && sphere.status === 'open';

                const participantIds = sphere.participants.map((participant) => participant.userId);

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
                    const userInfo = users.find((user) => user._id.equals(participant.userId)) || {};
                    const { _id, ...userInfoWithoutId } = userInfo;
                    return { ...participant, ...userInfoWithoutId };
                });

                const toKoreanTime = (date) => new Date(date.getTime() + 9 * 60 * 60 * 1000);
                const formatToMonthDay = (date) => `${date.getMonth() + 1}월 ${date.getDate()}일`;
                const formatToHour = (date) => {
                    const hours = date.getHours();
                    const period = hours >= 12 ? '오후' : '오전';
                    const hour12 = hours % 12 || 12;
                    return `${period} ${hour12}시`;
                };

                sphere.firstDate = formatToMonthDay(toKoreanTime(new Date(sphere.firstDate)));
                sphere.secondDate = formatToMonthDay(toKoreanTime(new Date(sphere.secondDate)));
                sphere.time = formatToHour(toKoreanTime(new Date(sphere.firstDate)));

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
