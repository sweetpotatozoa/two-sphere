// components/SignupHeader.jsx
'use client';

import React from 'react';
import Image from 'next/image';

const SignupHeader = () => {
    return (
        <header className="fixed top-0 left-1/2 transform -translate-x-1/2 w-full max-w-[500px] h-32 bg-black flex justify-center items-center z-50">
            {/* 헤더 이미지 */}
            <Image src="/signup-header.svg" alt="header" width={500} height={200} />
        </header>
    );
};

export default SignupHeader;
