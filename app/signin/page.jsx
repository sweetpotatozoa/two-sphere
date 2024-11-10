// app/signin/page.jsx
'use client';

import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '../../context/AuthContext';
import eyeIcon from '/public/eye-icon.svg';

const SignInPage = () => {
    const router = useRouter();
    const { isAuthenticated, login } = useAuth(); // AuthContext에서 값을 가져옴
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');

    // handleLogin 함수
    const handleLogin = async () => {
        setError(''); // 오류 초기화
        try {
            const response = await fetch('/api/auth/signin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();
            if (response.ok) {
                localStorage.setItem('token', data.token); // JWT 토큰 저장
                login(); // 로그인 상태 업데이트
                router.push('/'); // 로그인 후 홈 페이지로 이동
            } else {
                setError(data.message); // 오류 메시지 표시
            }
        } catch (error) {
            console.error('Login error:', error);
            setError('아이디 또는 비밀번호가 잘못되었습니다. 다시 시도해주세요.');
        }
    };

    // useEffect 부분
    useEffect(() => {
        // 로그인 상태라면 홈으로 리디렉션
        if (isAuthenticated) {
            router.push('/');
        }
    }, [isAuthenticated, router]);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSignup = () => {
        router.push('/signup');
    };

    return (
        <div className="max-w-[500px] mx-auto px-4 pt-16 space-y-6">
            {/* 로고 이미지 */}
            <div className="flex justify-center mb-8">
                <Image src="/twosphere-logo-black.svg" alt="TwoSphere Logo" width={240} height={70} />
            </div>

            {/* 아이디 입력 */}
            <div className="flex items-center border border-gray-300 rounded-full px-4 py-2">
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="아이디를 입력해주세요"
                    className="w-full outline-none text-gray-600"
                />
            </div>

            {/* 비밀번호 입력 */}
            <div className="flex items-center border border-gray-300 rounded-full px-4 py-2">
                <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="비밀번호를 입력해주세요"
                    className="w-full outline-none text-gray-600"
                />
                <button onClick={togglePasswordVisibility} className="flex items-center justify-center">
                    <Image src={eyeIcon} alt="Toggle Password Visibility" width={20} height={20} />
                </button>
            </div>

            {/* 로그인 오류 메시지 */}
            {error && <p className="text-red-500 text-center">{error}</p>}

            {/* 로그인 버튼 */}
            <button onClick={handleLogin} className="w-full py-3 bg-black text-white font-bold rounded-full">
                로그인
            </button>

            {/* 회원가입 버튼 */}
            <button
                onClick={handleSignup}
                className="w-full py-3 border border-black text-black font-bold rounded-full"
            >
                회원가입
            </button>
        </div>
    );
};

export default SignInPage;
