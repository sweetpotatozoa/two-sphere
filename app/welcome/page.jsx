'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const WelcomePage = () => {
    const router = useRouter();

    const goToProfile = () => {
        // 로그인 페이지로 이동하며 redirect 파라미터 추가
        router.push('/signin?redirect=/my-profile');
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
                프로필 작성하러 가기
            </button>
            <br />
            <h1 className="text-xl font-bold my-4 text-center">
                Sphere 참여를 위해서는
                <br />
                프로필을 완성하셔야 합니다.
            </h1>
        </div>
    );
};

export default WelcomePage;
