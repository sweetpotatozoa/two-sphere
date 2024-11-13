// app/spheres/open/page.jsx
'use client';

import React, { useEffect, useState } from 'react';
import { sphereData } from '../../data/sphereData';
import Image from 'next/image';
import { getOpenSpheres } from '@/utils/fetcher'; // Open 상태 데이터 호출 함수 추가
import { useRouter } from 'next/navigation';

export default function OpenSpheresPage() {
    const router = useRouter();
    const [openSpheres, setOpenSpheres] = useState([]); // open 상태인 스피어 동적 필터링
    const [isLoading, setIsLoading] = useState(true); // 로딩 상태 관리
    const [error, setError] = useState(null); // 에러 상태 관리

    useEffect(() => {
        const fetchOpenSpheres = async () => {
            try {
                const data = await getOpenSpheres(); // Open 상태 데이터 가져오기
                setOpenSpheres(data); // 상태 업데이트
            } catch (err) {
                setError('데이터를 불러오는 중 오류가 발생했습니다.'); // 에러 상태 설정
                console.error(err);
            } finally {
                setIsLoading(false); // 로딩 상태 비활성화
            }
        };

        fetchOpenSpheres();
    }, []);

    const handleSphereClick = (id) => {
        router.push(`/sphere/${id}`);
    };

    return (
        <div className="w-full max-w-[500px] mx-auto p-4">
            <h2 className="ml-2 text-xl font-bold mb-3 mt-2">진행 중인 Sphere</h2>
            <div className="flex flex-col space-y-2">
                {openSpheres.length > 0 ? (
                    openSpheres.map((sphere) => (
                        <div
                            key={sphere.id}
                            onClick={() => handleSphereClick(sphere._id)}
                            className="relative w-full h-48 bg-gray-800 rounded-xl overflow-hidden cursor-pointer"
                        >
                            <Image
                                src={sphere.image}
                                alt="Sphere Image"
                                layout="fill"
                                objectFit="cover"
                                className="rounded-lg opacity-80"
                            />
                            <div className="absolute inset-0 p-4 flex flex-col justify-between text-white">
                                <div>
                                    <h3 className="text-lg font-bold">{sphere.title}</h3>
                                    <p className="text-sm">{sphere.description}</p>
                                </div>
                                <div className="absolute bottom-0 left-0 w-full bg-black p-4 flex justify-between items-center text-xs rounded-b-lg">
                                    <span className="flex items-center space-x-1">
                                        <Image src="/location-icon.svg" alt="Location Icon" width={12} height={12} />
                                        <span>{sphere.location}</span>
                                    </span>
                                    <span className="flex items-center space-x-1">
                                        <Image src="/calendar-icon.svg" alt="Calendar Icon" width={12} height={12} />
                                        <span>{sphere.date}</span>
                                    </span>
                                </div>
                            </div>
                            <span className="absolute top-1 right-1 text-white p-2 rounded-md text-sm font-bold bg-black bg-opacity-75">
                                {sphere.dDay}
                            </span>
                        </div>
                    ))
                ) : (
                    // 'open' 상태의 스피어가 없을 때 중앙에 메시지 표시
                    <div className="flex items-center justify-center h-48 text-gray-500">
                        현재 진행 중인 스피어가 없습니다.
                    </div>
                )}
            </div>
        </div>
    );
}
