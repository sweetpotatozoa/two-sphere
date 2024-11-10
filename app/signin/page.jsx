// app/signin/page.jsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import eyeIcon from '/public/eye-icon.svg'; // 비밀번호 표시 아이콘 경로를 여기에 맞춰서 수정하세요.

const SignInPage = () => {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleLogin = () => {
        // 로그인 로직을 추가하세요.
        router.back(); // 로그인 후 이전 페이지로 돌아가기
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
                <input type="text" placeholder="아이디를 입력해주세요" className="w-full outline-none text-gray-600" />
            </div>

            {/* 비밀번호 입력 */}
            <div className="flex items-center border border-gray-300 rounded-full px-4 py-2">
                <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="비밀번호를 입력해주세요"
                    className="w-full outline-none text-gray-600"
                />
                <button onClick={togglePasswordVisibility} className="flex items-center justify-center">
                    <Image src={eyeIcon} alt="Toggle Password Visibility" width={20} height={20} />
                </button>
            </div>

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
