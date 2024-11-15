// components/OpenSpheres.jsx
'use client';

import React, { useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { getOpenSpheres } from '@/utils/fetcher'; // MongoDB 데이터 가져오는 함수
import arrowRightIcon from '/public/arrow-right-icon.svg';

const OpenSpheres = () => {
    const router = useRouter();
    const scrollRef = useRef(null);
    const [spheres, setSpheres] = useState([]); // MongoDB에서 불러온 데이터를 저장할 state
    const [isLoading, setIsLoading] = useState(true); // 로딩 상태 관리

    let isDown = false;
    let startX;
    let scrollLeft;

    // "더보기" 버튼 클릭 시 이동 핸들러
    const handleMoreClick = () => {
        router.push('/spheres/open');
    };

    // 스피어 클릭 시 이동 핸들러
    const handleSphereClick = (id) => {
        router.push(`/sphere/${id}`); // MongoDB ObjectId를 사용
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

    // MongoDB 데이터를 가져오는 useEffect
    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token'); // 인증 토큰 가져오기
                const data = await getOpenSpheres(token); // MongoDB 데이터 호출
                setSpheres(data); // state에 데이터 저장
            } catch (error) {
                console.error('Failed to fetch spheres:', error);
            } finally {
                setIsLoading(false); // 로딩 상태 업데이트
            }
        };

        fetchData();
    }, []);

    if (isLoading) {
        return <div className="text-center py-4">로딩 중...</div>; // 로딩 중 표시
    }

    return (
        <div className="w-full max-w-[500px] mx-auto mt-4 border-b border-black">
            {/* 상단 헤더 */}
            <div className="flex justify-between items-center mb-3">
                <h2 className="ml-6 text-xl font-extrabold">진행 중인 Sphere</h2>
                <button
                    onClick={handleMoreClick}
                    className="flex items-center justify-right mr-2 text-sm font-bold text-gray-600 hover:text-gray-800"
                >
                    더보기 <Image src={arrowRightIcon} alt="Toggle" width={16} height={16} className="mr-2" />
                </button>
            </div>

            {/* 슬라이딩 Sphere 목록 */}
            <div
                className="mb-4 flex overflow-x-auto space-x-4 scrollbar-hide pr-4"
                ref={scrollRef}
                onMouseDown={handleMouseDown}
                onMouseLeave={handleMouseLeave}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
            >
                {spheres.map((sphere) => (
                    <div
                        key={sphere._id} // MongoDB ObjectId 사용
                        onClick={() => handleSphereClick(sphere._id)} // ObjectId로 URL 전달
                        className="ml-4 last:mr-4 relative w-[320px] h-48 bg-gray-800 rounded-xl flex-shrink-0 overflow-hidden cursor-pointer"
                    >
                        {/* Sphere 이미지 */}
                        <Image
                            src={sphere.thumbnail} // MongoDB의 thumbnail 필드 사용
                            alt="Sphere Image"
                            layout="fill"
                            objectFit="cover"
                            className="rounded-xl opacity-80"
                        />
                        {/* Sphere 정보 오버레이 */}
                        <div className="absolute inset-0 p-4 flex flex-col justify-between text-white">
                            <div>
                                <h3 className="text-lg font-bold">{sphere.title}</h3>
                                <p className="text-sm">{sphere.subtitle}</p>
                            </div>
                            {/* 하단 전체를 감싸는 배경 영역 */}
                            <div className="absolute bottom-0 left-0 w-full bg-black p-3 flex justify-between items-center text-xs rounded-b-xl">
                                {/* 장소 표시 */}
                                {sphere.place?.name ? (
                                    <span className="font-bold flex items-center space-x-1">
                                        <Image src="/location-icon.svg" alt="Location Icon" width={12} height={12} />
                                        <span>{sphere.place.name}</span>
                                    </span>
                                ) : (
                                    <span className="font-bold">위치 없음</span>
                                )}
                                {/* First Date 표시 */}
                                <span className="font-bold flex items-center space-x-1">
                                    <Image src="/calendar-icon.svg" alt="Calendar Icon" width={12} height={12} />
                                    <span>{sphere.firstDate}</span>
                                </span>
                                <button className="py-1 px-2 bg-white text-black rounded-xl text-xs font-bold">
                                    자세히보기
                                </button>
                            </div>
                        </div>
                        {/* D-Day 계산 */}
                        <span className="absolute top-1 right-1 text-white p-2 rounded-xl text-sm font-bold bg-black bg-opacity-75">
                            {sphere.remainingDays === -1 ? 'D-DAY' : `D-${sphere.remainingDays}`}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OpenSpheres;
