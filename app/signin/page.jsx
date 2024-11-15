'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { signIn } from '../../utils/fetcher'; // fetcher.js에서 signIn 함수 가져오기
import eyeClosedIcon from '/public/eye-closed-icon.svg';
import eyeOpenIcon from '/public/eye-open-icon.svg';

const SignInPage = () => {
    const router = useRouter();
    const [userName, setUserName] = useState(''); // userName 필드로 수정
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const searchParams = useSearchParams();
    const redirectPath = searchParams.get('redirect') || '/';

    // 로그인 요청 처리 함수
    const handleLogin = async () => {
        setError('');
        try {
            const response = await signIn(userName, password);
            if (response && response.token) {
                localStorage.setItem('token', response.token);
                router.push(redirectPath); // 로그인 성공 후 redirectPath로 이동
            } else {
                setError('아이디 또는 비밀번호가 잘못되었습니다. 다시 시도해주세요.');
            }
        } catch (error) {
            setError('아이디 또는 비밀번호가 잘못되었습니다. 다시 시도해주세요.');
        }
    };

    // 비밀번호 표시/숨기기 토글
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    // 회원가입 페이지 이동
    const handleSignup = () => {
        router.push('/signup');
    };

    return (
        <div className="max-w-[500px] mx-auto px-4 pt-20 space-y-2">
            {/* 로고 */}
            <div className="flex justify-center mb-20">
                <Image src="/twosphere-logo-black.svg" alt="TwoSphere Logo" width={240} height={70} />
            </div>

            {/* 아이디 입력 */}
            <div className="flex items-center border border-gray-300 rounded-xl px-4 py-2">
                <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)} // userName으로 수정
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

            {/* 오류 메시지 */}
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
