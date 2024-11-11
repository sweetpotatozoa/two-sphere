// components/PartnersList.jsx
'use client';

import React, { useRef } from 'react';
import Image from 'next/image';

const PartnersList = () => {
    const scrollRef = useRef(null);
    let isDown = false;
    let startX;
    let scrollLeft;

    // 마우스 드래그로 스크롤 가능하게 설정
    const handleMouseDown = (e) => {
        isDown = true;
        startX = e.pageX - scrollRef.current.offsetLeft;
        scrollLeft = scrollRef.current.scrollLeft;
    };

    const handleMouseLeave = () => {
        isDown = false;
    };

    const handleMouseUp = () => {
        isDown = false;
    };

    const handleMouseMove = (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - scrollRef.current.offsetLeft;
        const walk = (x - startX) * 1.5; // 스크롤 속도 조절 (1.5로 설정하여 더 자연스럽게)
        scrollRef.current.scrollLeft = scrollLeft - walk;
    };

    return (
        <div className="w-full max-w-[500px] mx-auto border-b border-black">
            <h2 className="mb-3 mt-4 flex items-center justify-center text-xl font-bold">제휴 업체</h2>
            {/* 자동 슬라이딩 예정 */}
            <div
                className="mb-4 pr-4 flex overflow-x-auto space-x-4 scrollbar-hide"
                ref={scrollRef}
                onMouseDown={handleMouseDown}
                onMouseLeave={handleMouseLeave}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
            >
                {[1, 2, 3, 4, 5].map((sphere, index) => (
                    <div
                        key={index}
                        className="ml-4 relative w-48 h-48 bg-gray-800 rounded-xl flex-shrink-0 overflow-hidden"
                    >
                        {/* 장소 이미지 */}
                        <Image
                            src="/sample-sphere.svg" // 샘플 이미지 경로, 실제 이미지 경로로 변경
                            alt="Sphere Image"
                            layout="fill"
                            objectFit="cover"
                            className="rounded-lg opacity-80"
                        />
                        {/* 장소 정보 오버레이 */}
                        <div className="absolute inset-0 p-4 flex items-center justify-center text-center flex-col justify-between text-white">
                            <div>
                                <p className="text-sm">강남</p>
                                <h3 className="text-lg font-bold">아베크 청담</h3>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PartnersList;
