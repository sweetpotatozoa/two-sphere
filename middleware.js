// middleware.js

import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(req) {
    const authHeader = req.headers.get('authorization');
    const isSphereGetRequest = req.nextUrl.pathname.startsWith('/api/sphere') && req.method === 'GET';

    // /api/sphere/[id] 경로의 GET 요청에서만 토큰 유무에 따라 처리
    if (isSphereGetRequest) {
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            // GET 요청에서 토큰이 없으면 그대로 통과
            return NextResponse.next();
        }
    } else {
        // GET이 아닌 요청이나 다른 경로에서는 토큰이 반드시 있어야 함
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.redirect(new URL('/signin', req.url));
        }
    }

    const token = authHeader.split(' ')[1];

    try {
        // 비동기로 토큰 검증 수행
        const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.ACCESS_TOKEN_DEV));

        const response = NextResponse.next();
        response.headers.set('x-user-id', payload.user.id); // 사용자 ID를 응답 헤더에 설정
        return response;
    } catch (err) {
        return NextResponse.redirect(new URL('/signin', req.url)); // 유효하지 않은 토큰일 경우 리디렉션
    }
}

export const config = {
    matcher: ['/api/my-profile', '/api/my-spheres', '/api/sphere/[id]', '/api/sphere/[id]/cancel'], // 특정 경로에만 적용
};
