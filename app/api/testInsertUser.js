import clientPromise from './lib/mongodb';

async function insertMockUser() {
    try {
        // MongoDB 연결
        const client = await clientPromise;
        const db = client.db('user_data');

        // 가상의 유저 데이터
        const mockUser = {
            username: 'testuser',
            email: 'testuser@example.com',
            password: 'sprtmxm',
            createdAt: new Date(),
        };

        // users 컬렉션에 데이터 삽입
        const result = await db.collection('users').insertOne(mockUser);
        console.log('Mock user inserted with ID:', result.insertedId);
    } catch (error) {
        console.error('Error inserting mock user:', error);
    }
}

insertMockUser();
