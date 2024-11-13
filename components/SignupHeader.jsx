// components/Header.jsx
'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const Header = () => {
    const router = useRouter();

    const handleLogoClick = () => {
        router.push('/'); // 홈 페이지 경로
    };

    return (
        <header className="fixed top-0 left-1/2 transform -translate-x-1/2 w-full max-w-[500px] h-16 bg-black flex justify-center items-center z-50">
            {/* 로고 이미지 */}
            <Image
                src="/twosphere-logo-white.svg"
                alt="TwoSphere Logo"
                width={100}
                height={40}
                onClick={handleLogoClick}
                className="cursor-pointer"
            />
        </header>
    );
};

export default Header;
