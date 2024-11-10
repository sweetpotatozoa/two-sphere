// app/api/test-connection/route.js
import clientPromise from '@/lib/mongodb';

export async function GET(request) {
    try {
        const client = await clientPromise;
        const db = client.db();

        // 실제로 컬렉션을 조회하여 MongoDB 연결 상태를 확인
        const collections = await db.listCollections().toArray();
        return new Response(
            JSON.stringify({
                status: 'success',
                message: 'MongoDB connected successfully',
                collections: collections.map((col) => col.name),
            }),
            {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            }
        );
    } catch (error) {
        console.error('❌ MongoDB connection failed:', error);
        return new Response(
            JSON.stringify({
                status: 'error',
                message: 'MongoDB connection failed',
            }),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            }
        );
    }
}
