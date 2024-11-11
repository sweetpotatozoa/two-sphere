'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '../../context/AuthContext';
import { signIn } from '../../utils/fetcher'; // fetcher.js에서 signIn 함수 가져오기
import eyeClosedIcon from '/public/eye-closed-icon.svg';
import eyeOpenIcon from '/public/eye-open-icon.svg';

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
            const response = await signIn(username, password); // fetcher.js의 signIn 함수 호출
            if (response) {
                localStorage.setItem('token', response.token); // JWT 토큰 저장
                login(); // 로그인 상태 업데이트
                router.push('/'); // 로그인 후 홈 페이지로 이동
            } else {
                setError('아이디 또는 비밀번호가 잘못되었습니다. 다시 시도해주세요.');
            }
        } catch (error) {
            console.error('Login error:', error.message);
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
        <div className="max-w-[500px] mx-auto px-4 pt-20 space-y-2">
            {/* 로고 이미지 */}
            <div className="flex justify-center mb-20">
                <Image src="/twosphere-logo-black.svg" alt="TwoSphere Logo" width={240} height={70} />
            </div>

            {/* 아이디 입력 */}
            <div className="flex items-center border border-gray-300 rounded-xl px-4 py-2">
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="아이디를 입력해주세요"
                    className="w-full outline-none text-gray-600"
                />
            </div>

            {/* 비밀번호 입력 */}
            <div className="flex items-center border border-gray-300 rounded-xl px-4 py-2">
                <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="비밀번호를 입력해주세요"
                    className="w-full outline-none text-gray-600"
                />
                <button onClick={togglePasswordVisibility} className="flex items-center justify-center">
                    <Image
                        src={showPassword ? eyeOpenIcon : eyeClosedIcon}
                        alt="Toggle Password Visibility"
                        width={20}
                        height={20}
                    />
                </button>
            </div>

            {/* 로그인 오류 메시지 */}
            {error && <p className="text-red-500 text-center">{error}</p>}

            {/* 로그인 버튼 */}
            <button onClick={handleLogin} className="w-full py-3 bg-black text-white font-bold rounded-xl">
                로그인
            </button>

            {/* 회원가입 버튼 */}
            <button onClick={handleSignup} className="w-full py-3 border border-black text-black font-bold rounded-xl">
                회원가입
            </button>
        </div>
    );
};

export default SignInPage;
