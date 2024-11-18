'use client';

import React, { useRef, useEffect } from 'react';
import Image from 'next/image';
import { motion, useAnimation } from 'framer-motion';

const PartnersList = () => {
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

    // 리스트 반복으로 무한 스크롤 구현
    const repeatedList = Array.from({ length: 50 }, () => partnersList).flat();
    const sliderRef = useRef(null);
    const controls = useAnimation();

    useEffect(() => {
        // 애니메이션 시작
        controls.start({
            x: [0, -100 * repeatedList.length + '%'], // 전체 길이를 이동
            transition: {
                repeat: Infinity,
                ease: 'linear',
                duration: repeatedList.length * 7, // 리스트 길이에 비례한 속도 설정
            },
        });
    }, [controls, repeatedList.length]);

    return (
        <div className="w-full max-w-[500px] mx-auto border-b border-black">
            <div className="flex flex-col items-center my-4">
                <h2 className="text-xl font-bold">제휴 장소</h2>
                <p className="text-sm text-gray-600">선별된 공간에서 투스피어만의 특별한 혜택을 경험하세요</p>
            </div>
            {/* 슬라이드 컨테이너 */}
            <div className="relative w-full overflow-hidden px-4 pb-4">
                <motion.div
                    className="flex"
                    ref={sliderRef}
                    animate={controls} // 애니메이션 제어
                    style={{ display: 'flex', whiteSpace: 'nowrap' }} // 슬라이드 레이아웃 설정
                >
                    {repeatedList.map((place, index) => (
                        <a
                            key={index}
                            href={place.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="relative w-48 h-48 bg-gray-800 rounded-xl flex-shrink-0 overflow-hidden px-4 mx-2"
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
                </motion.div>
            </div>
        </div>
    );
};

export default PartnersList;
