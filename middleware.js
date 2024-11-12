// middleware.js

import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(req) {
    const authHeader = req.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return NextResponse.redirect(new URL('/signin', req.url)); // 로그인 페이지로 리디렉션
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
    matcher: ['/api/my-profile', '/api/my-spheres', '/api/sphere/[id]/cancel'], // 특정 경로에만 적용
};
