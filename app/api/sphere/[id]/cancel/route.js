import clientPromise from '@/lib/mongodb';
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';

export async function POST(req, { params }) {
    try {
        const { id } = params; // 동적 경로에서 sphere ID 가져오기
        const userId = req.headers.get('x-user-id'); // 요청한 유저의 ID 가져오기

        if (!userId) {
            return NextResponse.json({ message: '로그인 후 이용해 주세요' }, { status: 401 });
        }

        const client = await clientPromise;
        const db = client.db();

        // 스피어 정보 및 해당 유저의 참여 여부 가져오기
        const sphere = await db.collection('spheres').findOne(
            {
                _id: new ObjectId(id),
                'participants.userId': new ObjectId(userId),
            },
            { projection: { firstDate: 1, participants: 1 } }
        );

        // 참여 여부 확인
        if (!sphere) {
            return NextResponse.json({ message: 'Sphere not found or user not a participant' }, { status: 404 });
        }

        // participants 배열에서 userId가 일치하는 참여자 찾기
        const userParticipant = sphere.participants.find((participant) =>
            participant.userId.equals(new ObjectId(userId))
        );

        // 이미 취소자인 경우 오류
        if (userParticipant.cancelInfo?.isCancel) {
            return NextResponse.json({ message: '이미 취소된 참여입니다.' }, { status: 400 });
        }

        // 환불 가능 여부 계산
        let isRefundable = false;

        if (userParticipant.payment === 'unpaid') {
            isRefundable = false; // 돈을 내지 않은 경우 환불 불가
        } else {
            const now = new Date();
            const firstDate = new Date(sphere.firstDate);

            // firstDate 24시간 전까지 환불 가능
            isRefundable = now < new Date(firstDate.getTime() - 24 * 60 * 60 * 1000);
        }

        let cancelInfo = {
            isCancel: true,
            createdAt: new Date(),
        };

        // 요청 본문에서 계좌 정보, 은행, 이유 가져오기
        const { account, bank, reason } = await req.json();

        // 필수 필드 검증
        if (!reason) {
            return NextResponse.json({ message: 'Cancellation reason is required.' }, { status: 400 });
        }

        if (isRefundable) {
            // 환불 가능한 경우 계좌 및 은행 필드도 검증
            if (!account || !bank) {
                return NextResponse.json(
                    { message: 'Account and bank fields are required for a refundable cancellation.' },
                    { status: 400 }
                );
            }

            cancelInfo = {
                ...cancelInfo,
                account,
                bank,
                reason,
            };
        } else {
            // 환불 불가능한 경우 계좌 및 은행 필드는 없어야 함
            cancelInfo = {
                ...cancelInfo,
                reason,
            };
        }

        // 데이터베이스 업데이트
        await db
            .collection('spheres')
            .updateOne(
                { _id: new ObjectId(id), 'participants.userId': new ObjectId(userId) },
                { $set: { 'participants.$.cancelInfo': cancelInfo } }
            );

        return NextResponse.json(
            { message: '참여가 성공적으로 취소되었습니다.', refundable: isRefundable },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error canceling participation:', error);
        return NextResponse.json({ message: 'An error occurred while canceling participation' }, { status: 500 });
    }
}

export async function GET(req, { params }) {
    try {
        const { id } = params; // 동적 경로에서 sphere ID 가져오기
        const userId = req.headers.get('x-user-id'); // 요청한 유저의 ID 가져오기

        if (!userId) {
            return NextResponse.json({ message: '로그인 후 이용해 주세요' }, { status: 401 });
        }

        const client = await clientPromise;
        const db = client.db();

        // 스피어 정보 가져오기
        const sphere = await db
            .collection('spheres')
            .findOne({ _id: new ObjectId(id) }, { projection: { firstDate: 1, participants: 1 } });

        if (!sphere) {
            return NextResponse.json({ message: '스피어를 찾을 수 없습니다.' }, { status: 404 });
        }

        // 요청 유저의 참여 정보 확인
        const userParticipant = sphere.participants.find((participant) =>
            participant.userId.equals(new ObjectId(userId))
        );

        if (!userParticipant) {
            return NextResponse.json({ message: '스피어에 참여하지 않았습니다.' }, { status: 400 });
        }

        if (userParticipant.cancelInfo?.isCancel) {
            return NextResponse.json({ message: '이미 취소한 상태입니다.' }, { status: 400 });
        }

        // 환불 가능 여부 계산
        let isRefundable = false;

        if (userParticipant.payment === 'unpaid') {
            isRefundable = false; // 돈을 내지 않은 경우 환불 불가
        } else {
            const now = new Date();
            const firstDate = new Date(sphere.firstDate);

            // firstDate 24시간 전까지 환불 가능
            isRefundable = now < new Date(firstDate.getTime() - 24 * 60 * 60 * 1000);
        }
        return NextResponse.json({ isRefundable }, { status: 200 });
    } catch (error) {
        console.error('Error checking refundable status:', error);
        return NextResponse.json({ message: '환불 가능 여부를 확인하는 중 오류가 발생했습니다.' }, { status: 500 });
    }
}
