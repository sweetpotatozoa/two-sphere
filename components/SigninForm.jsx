import React, { useState, useEffect } from 'react';
import fetcher from '../utils/fetcher'; // API 호출 유틸리티
import { useRouter } from 'next/router';

function SigninForm() {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    // 이미 로그인된 경우 자동 로그인
    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (token) {
            alert('이미 로그인된 사용자입니다.');
            router.back(); // 이전 페이지로 이동
        }
    }, []);

    const handleSignin = async (e) => {
        e.preventDefault(); // 폼 기본 동작 방지

        try {
            const response = await fetcher(
                '/api/signin', // 로그인 API
                '', // 로그인 시 토큰이 필요하지 않음
                'POST',
                { userName, password } // 요청 데이터
            );

            if (response && response.token) {
                localStorage.setItem('authToken', response.token); // JWT 토큰 저장
                alert('로그인 성공!');
                router.back(); // 이전 페이지로 이동
            } else {
                setError(response?.message || '로그인에 실패했습니다.');
            }
        } catch (err) {
            setError('네트워크 오류가 발생했습니다.');
        }
    };

    return (
        <form onSubmit={handleSignin}>
            <input
                type="text"
                placeholder="Username"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                required
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            <button type="submit">로그인</button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </form>
    );
}

export default SigninForm;
