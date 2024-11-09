// components/OpenSpheres.jsx
'use client';

import React, { useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { sphereData } from '../app/data/sphereData';

const OpenSpheres = () => {
    const router = useRouter();
    const scrollRef = useRef(null);
    let isDown = false;
    let startX;
    let scrollLeft;

    // "더보기" 버튼 클릭 시 이동 핸들러
    const handleMoreClick = () => {
        router.push('/spheres/open');
    };

    // 스피어 클릭 시 이동 핸들러
    const handleSphereClick = (id) => {
        router.push(`/sphere/${id}`);
    };

    // 마우스 드래그로 스크롤 설정
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
        const walk = (x - startX) * 1.5;
        scrollRef.current.scrollLeft = scrollLeft - walk;
    };

    return (
        <div className="w-full max-w-[500px] mx-auto p-4 border-b border-black">
            {/* 상단 헤더 */}
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">진행 중인 Sphere</h2>
                <button onClick={handleMoreClick} className="text-sm text-gray-600 hover:text-gray-800">
                    더보기 &gt;
                </button>
            </div>

            {/* 슬라이딩 Sphere 목록 */}
            <div
                className="flex overflow-x-auto space-x-4 scrollbar-hide"
                ref={scrollRef}
                onMouseDown={handleMouseDown}
                onMouseLeave={handleMouseLeave}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
            >
                {sphereData.map((sphere) => (
                    <div
                        key={sphere.id}
                        onClick={() => handleSphereClick(sphere.id)}
                        className="relative w-[350px] h-48 bg-gray-800 rounded-xl flex-shrink-0 overflow-hidden cursor-pointer"
                    >
                        {/* Sphere 이미지 */}
                        <Image
                            src={sphere.image}
                            alt="Sphere Image"
                            layout="fill"
                            objectFit="cover"
                            className="rounded-lg opacity-80"
                        />
                        {/* Sphere 정보 오버레이 */}
                        <div className="absolute inset-0 p-4 flex flex-col justify-between text-white">
                            <div>
                                <h3 className="text-lg font-bold">{sphere.title}</h3>
                                <p className="text-sm">{sphere.description}</p>
                            </div>
                            {/* 하단 전체를 감싸는 배경 영역 */}
                            <div className="absolute bottom-0 left-0 w-full bg-black p-4 flex justify-between items-center text-xs rounded-b-lg">
                                <span className="flex items-center space-x-1">
                                    <Image src="/location-icon.svg" alt="Location Icon" width={12} height={12} />
                                    <span>{sphere.location}</span>
                                </span>
                                <span className="flex items-center space-x-1">
                                    <Image src="/calendar-icon.svg" alt="Calendar Icon" width={12} height={12} />
                                    <span>{sphere.date}</span>
                                </span>
                                <button className="py-1 px-2 bg-white text-black rounded-full text-xs font-bold">
                                    자세히보기
                                </button>
                            </div>
                        </div>
                        {/* D-Day 표시 */}
                        <span className="absolute top-1 right-1 text-white p-2 rounded-md text-sm font-bold bg-black bg-opacity-75">
                            {sphere.dDay}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OpenSpheres;
