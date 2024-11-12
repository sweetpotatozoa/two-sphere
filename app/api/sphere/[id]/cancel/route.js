import clientPromise from '@/lib/mongodb';
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';

export async function POST(req, { params }) {
    try {
        const { id } = params; // 동적 경로에서 sphere ID 가져오기
        const userId = req.headers.get('x-user-id'); // 요청한 유저의 ID 가져오기
        const { account, bank, reason } = await req.json(); // 요청 바디에서 취소 관련 정보 가져오기

        if (!userId) {
            return NextResponse.json({ message: '로그인 후 이용해 주세요' }, { status: 401 });
        }

        const client = await clientPromise;
        const db = client.db();

        // sphere 정보 가져오기
        const sphere = await db.collection('spheres').findOne({ _id: new ObjectId(id) });
        if (!sphere) {
            return NextResponse.json({ message: 'Sphere not found' }, { status: 404 });
        }

        // 사용자가 해당 sphere의 참가자인지 확인
        const participantIndex = sphere.participants.findIndex((participant) =>
            participant.userId.equals(new ObjectId(userId))
        );
        if (participantIndex === -1) {
            return NextResponse.json({ message: 'Not a participant of this sphere' }, { status: 400 });
        }

        // 해당 참여자의 참여 취소 정보 설정
        const cancelInfo = {
            isCancel: true,
            account,
            bank,
            reason,
            createdAt: new Date(),
        };

        // participants 배열에서 해당 참여자의 cancelInfo 업데이트
        sphere.participants[participantIndex].cancelInfo = cancelInfo;

        await db
            .collection('spheres')
            .updateOne(
                { _id: new ObjectId(id), 'participants.userId': new ObjectId(userId) },
                { $set: { 'participants.$.cancelInfo': cancelInfo } }
            );

        return NextResponse.json({ message: 'Successfully canceled participation' }, { status: 200 });
    } catch (error) {
        console.error('Cancel participation error:', error);
        return NextResponse.json({ message: 'An error occurred while canceling participation' }, { status: 500 });
    }
}
