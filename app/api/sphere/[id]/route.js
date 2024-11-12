import clientPromise from '@/lib/mongodb';
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { DateTime } from 'luxon';

export async function GET(req, { params }) {
    try {
        const { id } = params;
        const userId = req.headers.get('x-user-id');

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

        // 요청 유저가 참여자인 경우 유저의 참여 정보 가져오기
        const userParticipant = userId
            ? sphere.participants.find((participant) => participant.userId.equals(new ObjectId(userId)))
            : null;

        // 완료된 스피어거나, 요청 유저의 참여 정보가 없거나 결제가 완료되지 않았거나 취소한 경우 이름과 이미지를 볼 수 없음
        const canNotViewNamesAndImages =
            !userId ||
            !userParticipant ||
            userParticipant.payment === 'unpaid' ||
            userParticipant.cancelInfo?.isCancel ||
            sphere.status === 'closed';

        // 이름과 이미지를 볼 수 있는지 여부 넣어주기
        sphere.canNotViewNamesAndImages = canNotViewNamesAndImages;

        // 요청 유저의 결제 상태 넣어주기
        sphere.hasUnpaidStatus =
            userParticipant && userParticipant.payment === 'unpaid' && !userParticipant.cancelInfo?.isCancel;

        // 요청 유저가 취소자인지 넣어주기
        const isCanceled = userParticipant && userParticipant.cancelInfo?.isCancel;
        sphere.isCanceled = isCanceled;

        // 취소된 참여자 제외
        sphere.participants = sphere.participants.filter((participant) => !participant.cancelInfo?.isCancel);

        // 가져올 참여자 아이디 배열 생성
        const participantIds = sphere.participants.map((participant) => participant.userId);

        let projection = {
            createdAt: 0,
            updatedAt: 0,
            isProfiled: 0,
            phoneNumber: 0,
            password: 0,
            userName: 0,
        };

        // 모임이 종료되었거나 이름과 이미지를 볼 수 없는 경우 이름과 이미지를 제외
        if (sphere.status === 'closed' || canNotViewNamesAndImages) {
            projection = { ...projection, name: 0, image: 0 };
        }

        // 참여자 정보 가져오기
        const users = await db
            .collection('users')
            .find({ _id: { $in: participantIds } }, { projection })
            .toArray();

        // 참여자 정보 매핑
        sphere.participants = sphere.participants.map((participant) => {
            const userInfo = users.find((user) => user._id.equals(participant.userId)) || {};
            const { _id, ...userInfoWithoutId } = userInfo;

            return {
                ...participant,
                ...userInfoWithoutId,
            };
        });

        // 날짜 및 시간 정보 포맷팅
        const formatToMonthDay = (date) => `${date.getMonth() + 1}월 ${date.getDate()}일`;
        const formatToHour = (date) => {
            const hours = date.getHours();
            const period = hours >= 12 ? '오후' : '오전';
            const hour12 = hours % 12 || 12;
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

export async function POST(req, { params }) {
    try {
        const { id } = params;
        const userId = req.headers.get('x-user-id');

        if (!userId) {
            return NextResponse.json({ message: '로그인 후 이용해 주세요' }, { status: 401 });
        }

        const { isHost } = await req.json();

        const client = await clientPromise;
        const db = client.db();

        const userObjectId = new ObjectId(userId);
        const user = await db.collection('users').findOne({ _id: userObjectId });
        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        const sphere = await db.collection('spheres').findOne({ _id: new ObjectId(id) });
        if (!sphere) {
            return NextResponse.json({ message: 'Sphere not found' }, { status: 404 });
        }

        // 스피어 상태 확인
        if (sphere.status !== 'open') {
            return NextResponse.json({ message: 'The sphere is not open' }, { status: 400 });
        }

        // 이미 참가자인지 확인
        const isAlreadyParticipant = sphere.participants.some((participant) => participant.userId.equals(userObjectId));
        if (isAlreadyParticipant) {
            return NextResponse.json({ message: 'Already a participant' }, { status: 400 });
        }

        // 취소된 참가자인지 확인
        const isCanceledParticipant = sphere.participants.some(
            (participant) => participant.userId.equals(userObjectId) && participant.cancelInfo?.isCancel
        );
        if (isCanceledParticipant) {
            return NextResponse.json({ message: '취소자는 재신청이 불가능합니다' }, { status: 400 });
        }

        const newParticipant = {
            userId: userObjectId,
            payment: 'unpaid',
            isHost,
            cancelInfo: {
                isCancel: false,
                account: '',
                bank: '',
                reason: '',
                createdAt: null,
            },
            attendCount: 0,
            createdAt: DateTime.now().setZone('Asia/Seoul'),
        };

        await db
            .collection('spheres')
            .updateOne({ _id: new ObjectId(id) }, { $push: { participants: newParticipant } });

        return NextResponse.json({ message: 'Successfully joined the sphere' }, { status: 200 });
    } catch (error) {
        console.error('Join sphere error:', error);
        return NextResponse.json({ message: 'An error occurred while joining the sphere' }, { status: 500 });
    }
}
