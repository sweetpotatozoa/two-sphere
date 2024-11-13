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
