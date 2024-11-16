// components/Banner.jsx
'use client';

import React from 'react';
import Image from 'next/image';

const Banner = () => {
    return (
        <div className="relative w-full h-48 bg-gray-200 flex items-center justify-center border-b border-black overflow-hidden">
            {/* 배경 이미지 */}
            <Image src="/banner.svg" alt="banner" layout="fill" objectFit="cover" className="absolute inset-0 z-0" />
            {/* 오버레이 텍스트 */}
            <h2 className="relative z-10 text-xl font-bold text-white text-center drop-shadow-[0_2px_2px_rgba(0,0,0,10)]">
                취향의 궤도가 만나는
                <br />두 번의 특별한 순간
            </h2>
        </div>
    );
};

export default Banner;
