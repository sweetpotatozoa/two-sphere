//app/api/sphere/[id]/route.js
import clientPromise from '@/lib/mongodb';
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';

export async function GET(req, { params }) {
    try {
        const { id } = params;
        const userId = req.headers.get('x-user-id');

        const client = await clientPromise;
        const db = client.db();

        // 사용자 role 가져오기 (userId 유효성 검사 추가)
        let user = null;
        if (userId && ObjectId.isValid(userId)) {
            user = await db.collection('users').findOne({ _id: new ObjectId(userId) });
        }

        // sphere 정보 가져오기
        const sphere = await db.collection('spheres').findOne(
            { _id: new ObjectId(id) },
            {
                projection: {
                    _id: 1,
                    title: 1,
                    description: 1,
                    place: 1,
                    thumbnail: 1,
                    firstDate: 1,
                    secondDate: 1,
                    subImage1: 1,
                    subImage2: 1,
                    subjects: 1,
                    participants: 1,
                    status: 1,
                    placeStory: 1,
                    questions: 1,
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
        // 단, 사용자가 admin일 경우 제외
        const canNotViewNamesAndImages =
            !(user?.role === 'admin') && // 관리자는 항상 이름과 이미지를 볼 수 있음
            (!userId ||
                !userParticipant ||
                userParticipant.payment === 'unpaid' ||
                userParticipant.cancelInfo?.isCancel ||
                sphere.status === 'closed');

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

        // 참여, 취소 가능 여부 상태 초기값
        let showJoinOrCancelOrClosed = 'showJoin'; // 기본값을 참여 가능으로 설정

        if (sphere.status !== 'open') {
            showJoinOrCancelOrClosed = 'showClosed'; // 스피어가 열려 있지 않으면 상태 결정 중단
        } else if (!userId || !userParticipant) {
            showJoinOrCancelOrClosed = 'showJoin'; // 로그인하지 않았거나 참여자가 아니면 참여 가능
        } else if (userParticipant && !isCanceled) {
            showJoinOrCancelOrClosed = 'showCancel'; // 참여 중이고 아직 취소하지 않았으면 취소 가능
        } else if (isCanceled) showJoinOrCancelOrClosed = 'showAlreadyCanceled'; // 참여 중이지만 이미 취소한 경우 다시 참여 가능

        sphere.showJoinOrCancelOrClosed = showJoinOrCancelOrClosed;

        // 요청 유저의 로그인, 프로필 완성 여부
        let canJoin = 'haveToSignin';

        if (!userId) {
            canJoin = 'haveToSignin';
        } else {
            const user = await db.collection('users').findOne({ _id: new ObjectId(userId) });

            if (!user) {
                canJoin = 'haveToSignin'; // user가 존재하지 않으면 로그인 필요 상태
            } else if (!user.isProfiled) {
                canJoin = 'haveToWriteProfile'; // 프로필이 완성되지 않은 경우
            } else {
                canJoin = 'canJoin'; // 기본적으로 참여 가능
            }
        }

        sphere.canJoin = canJoin;

        let projection = {
            createdAt: 0,
            updatedAt: 0,
            isProfiled: 0,
            password: 0,
            userName: 0,
        };

        // 모임이 종료되었거나 이름과 이미지를 볼 수 없는 경우 이름과 이미지를 제외
        if (sphere.status === 'closed' || canNotViewNamesAndImages) {
            projection.image = 0;
        }

        // 참여자 정보 가져오기
        const users = await db
            .collection('users')
            .find({ _id: { $in: participantIds } }, { projection, name: 1, job: 1, phoneNumber: 1 })
            .toArray();

        // 나이대를 계산하는 함수
        const calculateAgeGroup = (birthDate) => {
            if (!birthDate) return '알 수 없음'; // birthDate가 없는 경우 처리
            const birth = new Date(birthDate);
            const current = new Date();
            const currentYear = current.getFullYear();
            const birthYear = birth.getFullYear();

            // 한국 나이 계산 (태어난 해를 1살로 시작)
            const koreanAge = currentYear - birthYear + 1;

            if (koreanAge >= 20 && koreanAge < 30) return '20대';
            if (koreanAge >= 30 && koreanAge < 40) return '30대';
            if (koreanAge >= 40 && koreanAge < 50) return '40대';
            return '50대 이상'; // 그 외 나이대 처리
        };

        // 참여자 정보 매핑
        sphere.participants = sphere.participants.map((participant) => {
            const userInfo = users.find((user) => user._id.equals(participant.userId)) || {};
            const { _id, ...userInfoWithoutId } = userInfo;

            return {
                ...participant,
                userId: participant.userId, // 유지
                name: userInfo.name || '이름 없음',
                job: userInfo.job || '직업 없음',
                phoneNumber: userInfo.phoneNumber || '전화번호 없음',
                age: calculateAgeGroup(userInfo.birthDate),
                career: userInfo.career || '커리어 없음',
                answers: userInfo.answers || [],
                image: userInfo.image || null,
            };
        });

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

        // 한국 시간대로 오전/오후 ~시 ~분 형식 변환
        const formatToHourMinute = (date) => {
            return date.toLocaleTimeString('ko-KR', {
                hour: 'numeric',
                minute: 'numeric',
                hour12: true,
                timeZone: 'Asia/Seoul',
            });
        };

        const formattedSphere = {
            ...sphere,
            firstDate: formatToMonthDay(new Date(sphere.firstDate)),
            secondDate: formatToMonthDay(new Date(sphere.secondDate)),
            time: formatToHourMinute(new Date(sphere.firstDate)),
        };

        return NextResponse.json(formattedSphere, { status: 200 });
    } catch (error) {
        console.error('Get sphere info error:', error);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

// POST 요청을 처리하여 사용자를 스피어에 참여시키는 핸들러
export async function POST(req, { params }) {
    try {
        const { id } = params;
        const userId = req.headers.get('x-user-id');

        if (!userId) {
            return NextResponse.json({ message: '로그인 후 이용해 주세요' }, { status: 401 });
        }

        const { requestLeader } = await req.json();

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

        // 취소하지 않은 참가자가 4명 초과이면 신청 불가능
        const activeParticipants = sphere.participants.filter((participant) => !participant.cancelInfo?.isCancel);
        if (activeParticipants.length >= 4) {
            return NextResponse.json({ message: '참여 인원이 다 찼습니다.' }, { status: 400 });
        }

        const newParticipant = {
            userId: userObjectId,
            payment: 'unpaid',
            requestLeader: requestLeader,
            isLeader: false,
            cancelInfo: {
                isCancel: false,
                account: '',
                bank: '',
                reason: '',
                createdAt: null,
            },
            attendCount: 0,
            createdAt: new Date(),
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
