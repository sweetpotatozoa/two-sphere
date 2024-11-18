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

    // 장소 데이터
    const partnersList = [
        {
            name: '아베크 청담',
            region: '강남',
            image: 'https://drive.google.com/uc?export=view&id=1K754nUwYGkP8ivSE2Z9pm7ZjHds3IAat',
            link: 'https://naver.me/GxOROhLR',
        },
        {
            name: '아르데레',
            region: '강남',
            image: 'https://drive.google.com/uc?export=view&id=1dxusdMn96Y6et227YF9T0uIy8NJpk2Sb',
            link: 'https://naver.me/GpfLfFQO',
        },
        {
            name: '에클리코',
            region: '강남',
            image: 'https://drive.google.com/uc?export=view&id=1T0ZzNwRnlTpXY6GxNEDi2BShW5EOPswr',
            link: 'https://naver.me/GsPzDYMn',
        },
        {
            name: '술비',
            region: '연남',
            image: 'https://drive.google.com/uc?export=view&id=1sw2_xR7tKMJUHXh6XjatVeFS6ySS94MZ',
            link: 'https://naver.me/xf5xo9N5',
        },
        {
            name: '텐바',
            region: '성수',
            image: 'https://drive.google.com/uc?export=view&id=1ZG4hXALS92pzmgGxMjI10ZygIcBfw-4r',
            link: 'https://naver.me/IGmKlZde',
        },
        {
            name: '멜트',
            region: '용산',
            image: 'https://drive.google.com/uc?export=view&id=1G8nFCYEWPRKwzqgLHHJUV3sKvgsW7nP4',
            link: 'https://naver.me/FoRPvGbp',
        },
        {
            name: '시즈널리티',
            region: '여의도',
            image: 'https://drive.google.com/uc?export=view&id=1bgDcI7rRz6356zVz6FyMSSDh9APm9tgL',
            link: 'https://naver.me/FGeSjjDp',
        },
    ];

    return (
        <div className="w-full max-w-[500px] mx-auto border-b border-black">
            <div className="flex flex-col items-center my-4">
                <h2 className="text-xl font-bold">제휴 장소</h2>
                <p className="text-sm text-gray-600">선별된 공간에서 투스피어만의 특별한 혜택을 경험하세요</p>
            </div>
            {/* 자동 슬라이딩 예정 */}
            <div
                className="mb-4 pr-4 flex overflow-x-auto space-x-4 scrollbar-hide"
                ref={scrollRef}
                onMouseDown={handleMouseDown}
                onMouseLeave={handleMouseLeave}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
            >
                {partnersList.map((place, index) => (
                    <a
                        key={index}
                        href={place.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-4 relative w-48 h-48 bg-gray-800 rounded-xl flex-shrink-0 overflow-hidden"
                    >
                        {/* 장소 이미지 */}
                        <Image
                            src={place.image}
                            alt={`${place.name} Image`}
                            layout="fill"
                            objectFit="cover"
                            className="rounded-lg opacity-80"
                        />
                        {/* 장소 정보 오버레이 */}
                        <div className="absolute inset-0 p-4 flex items-center justify-center text-center flex-col justify-between text-white">
                            <div>
                                <p className="text-sm">{place.region}</p>
                                <h3 className="text-lg font-bold">{place.name}</h3>
                            </div>
                        </div>
                    </a>
                ))}
            </div>
        </div>
    );
};

export default PartnersList;
