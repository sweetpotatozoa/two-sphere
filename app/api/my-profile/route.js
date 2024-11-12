// app/api/my-profile/route.js

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

        const user = await db
            .collection('users')
            .findOne({ _id: new ObjectId(userId) }, { projection: { name: 1, career: 1, answers: 1, image: 1 } });

        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({ user }, { status: 200 });
    } catch (error) {
        console.error('Get user info error:', error);
        return NextResponse.json({ message: 'An error occurred while fetching user info' }, { status: 500 });
    }
}

export async function PUT(req) {
    try {
        const userId = req.headers.get('x-user-id');
        if (!userId) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const client = await clientPromise;
        const db = client.db();

        // 요청 본문에서 업데이트할 데이터 가져오기
        const updates = await req.json();
        const allowedUpdates = ['career', 'answers', 'image']; // 업데이트 가능한 필드만 허용
        const updateFields = {};

        // 유효한 필드만 updateFields에 추가
        for (const key in updates) {
            if (allowedUpdates.includes(key)) {
                updateFields[key] = updates[key];
            }
        }

        // 업데이트할 데이터가 없는 경우 오류 반환
        if (Object.keys(updateFields).length === 0) {
            return NextResponse.json({ message: 'No valid fields to update' }, { status: 400 });
        }

        // MongoDB에서 사용자 정보 업데이트
        const result = await db.collection('users').updateOne({ _id: new ObjectId(userId) }, { $set: updateFields });

        if (result.matchedCount === 0) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Profile updated successfully' }, { status: 200 });
    } catch (error) {
        console.error('Update user profile error:', error);
        return NextResponse.json({ message: 'An error occurred while updating profile' }, { status: 500 });
    }
}
