'use client'; // 이 파일을 Client Component로 선언

import React, { useState } from 'react';
import fetcher from '../../utils/fetcher'; // API 호출 유틸리티
import { useRouter } from 'next/navigation'; // Next.js 라우팅 훅

export default function SigninPage() {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSignin = async (e) => {
        e.preventDefault(); // 폼 기본 제출 방지

        try {
            const response = await fetcher(
                '/api/signin', // API 엔드포인트
                '', // 로그인 시에는 토큰이 필요하지 않음
                'POST', // HTTP 메서드
                { userName, password } // 요청 데이터
            );

            if (response && response.token) {
                localStorage.setItem('authToken', response.token); // JWT 토큰 저장
                alert('로그인 성공!');
                router.push('/'); // 로그인 후 홈으로 리다이렉트
            } else {
                setError(response?.message || '로그인에 실패했습니다.');
            }
        } catch (err) {
            setError('네트워크 오류가 발생했습니다.');
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center">
            <h1 className="text-2xl font-bold mb-4">로그인</h1>
            <form onSubmit={handleSignin} className="flex flex-col space-y-4">
                <input
                    type="text"
                    placeholder="Username"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    required
                    className="border rounded p-2"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="border rounded p-2"
                />
                <button type="submit" className="bg-blue-500 text-white rounded p-2">
                    로그인
                </button>
            </form>
            {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
    );
}
