// app/welcome/page.jsx
'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const WelcomePage = () => {
    const router = useRouter();

    const goToProfile = () => {
        router.push('/signin'); // '프로필 완성하러 가기' 버튼 클릭 시 로그인 경로로 이동
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
            {/* 상단 로고 */}
            <div className="mb-8">
                <Image src="/twosphere-logo-white.svg" alt="TwoSphere Logo" width={150} height={50} />
            </div>

            {/* 환영 메시지 */}
            <h1 className="text-2xl font-bold mb-4">가입을 환영합니다!</h1>

            {/* 프로필 완성 버튼 */}
            <button onClick={goToProfile} className="mt-4 px-6 py-3 bg-white text-black font-bold rounded-xl">
                프로필 완성하러 가기
            </button>
        </div>
    );
};

export default WelcomePage;
