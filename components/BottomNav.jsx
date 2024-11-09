// components/BottomNav.jsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import MenuBar from './MenuBar';

const BottomNav = () => {
    const router = useRouter();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // 메뉴 토글 함수
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    // 네비게이션 핸들러
    const handleNavigation = (path) => {
        router.push(path);
        setIsMenuOpen(false); // 메뉴 닫기
    };

    return (
        <div className="relative w-full max-w-[500px] mx-auto">
            {/* 메뉴 바 */}
            <MenuBar isOpen={isMenuOpen} toggleMenu={toggleMenu} />

            {/* 하단 네비게이션 */}
            <nav className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-[500px] h-20 bg-black flex justify-around items-center z-50">
                <button
                    onClick={toggleMenu}
                    className="flex-1 text-center text-white flex flex-col items-center space-y-1"
                >
                    <Image src="/menu-icon.svg" alt="Menu Icon" width={24} height={24} />
                    <span>메뉴</span>
                </button>
                <button
                    onClick={() => handleNavigation('/')}
                    className="flex-1 text-center text-white flex flex-col items-center space-y-1"
                >
                    <Image src="/home-icon.svg" alt="Home Icon" width={24} height={24} />
                    <span>홈</span>
                </button>
                <button
                    onClick={() => handleNavigation('/my-spheres')}
                    className="flex-1 text-center text-white flex flex-col items-center space-y-1"
                >
                    <Image src="/heart-icon.svg" alt="Heart Icon" width={24} height={24} />
                    <span>내 스피어</span>
                </button>
                <button
                    onClick={() => handleNavigation('/my-profile')}
                    className="flex-1 text-center text-white flex flex-col items-center space-y-1"
                >
                    <Image src="/profile-icon.svg" alt="Profile Icon" width={24} height={24} />
                    <span>프로필</span>
                </button>
            </nav>
        </div>
    );
};

export default BottomNav;
