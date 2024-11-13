//app/api/sphere/[id]/route.js
import clientPromise from '@/lib/mongodb';
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';

export async function GET(req, { params }) {
    try {
        const { id } = params;

        if (!ObjectId.isValid(id)) {
            return NextResponse.json({ message: 'Invalid ID format' }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db();

        const sphere = await db.collection('spheres').findOne({ _id: new ObjectId(id) });

        if (!sphere) {
            return NextResponse.json({ message: 'Sphere not found' }, { status: 404 });
        }

        return NextResponse.json(sphere, { status: 200 });
    } catch (error) {
        console.error('Error fetching sphere:', error);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

// POST 요청을 처리하여 사용자를 스피어에 참여시키는 핸들러
export async function POST(req, { params }) {
    try {
        const { id } = params;
        if (!ObjectId.isValid(id)) {
            return NextResponse.json({ message: 'Invalid ID format' }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db();

        // 요청 본문에서 참여 데이터 가져오기
        const { userId, isHost } = await req.json();

        // 스피어가 존재하는지 확인
        const sphere = await db.collection('spheres').findOne({ _id: new ObjectId(id) });
        if (!sphere) {
            return NextResponse.json({ message: 'Sphere not found' }, { status: 404 });
        }

        // 참가자 정보 추가
        const participant = {
            userId,
            isHost,
            payment: 'unpaid', // 기본값 설정
            attendCount: 0,
            createdAt: new Date(),
            cancelInfo: {
                isCancel: false,
                account: '',
                bank: '',
                reason: '',
                createdAt: null,
            },
        };

        // MongoDB 업데이트
        await db.collection('spheres').updateOne({ _id: new ObjectId(id) }, { $push: { participants: participant } });

        return NextResponse.json({ message: 'Participation successful' }, { status: 201 });
    } catch (error) {
        console.error('Error processing participation:', error);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
