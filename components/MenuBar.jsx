// components/MenuBar.jsx
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

const MenuBar = ({ isOpen, toggleMenu }) => {
    const router = useRouter();

    if (!isOpen) return null;

    const handleNavigation = (path) => {
        router.push(path);
        toggleMenu(); // 메뉴 닫기
    };

    return (
        <div className="fixed top-12 left-1/2 transform -translate-x-1/2 w-full max-w-[500px] h-[calc(100vh-3rem)] z-40 flex">
            <div className="mt-2 w-1/2 max-w-[250px] h-full bg-black text-white flex flex-col p-6 space-y-4">
                <button className="text-left" onClick={() => handleNavigation('/about')}>
                    About
                </button>
                <button className="text-left" onClick={() => handleNavigation('/spheres/open')}>
                    진행중인 Sphere
                </button>
                <button className="text-left" onClick={() => handleNavigation('/spheres/closed')}>
                    지난 Sphere
                </button>
                <button className="text-left" onClick={() => handleNavigation('/FAQ')}>
                    FAQ
                </button>
                <button className="text-left" onClick={toggleMenu}>
                    <a href="mailto:team.twosphere@gmail.com" className="hover:underline">
                        의견보내기
                    </a>
                </button>
            </div>
            <div className="flex-1 h-full bg-black bg-opacity-50" onClick={toggleMenu}></div>
        </div>
    );
};

export default MenuBar;
