'use client';

import React, { useEffect, useState } from 'react';
import { getClosedSpheres } from '@/utils/fetcher'; // MongoDB에서 닫힌 Sphere 데이터를 가져오는 함수
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function ClosedSpheresPage() {
    const router = useRouter();
    const [closedSpheres, setClosedSpheres] = useState([]); // MongoDB에서 가져온 데이터를 저장할 상태
    const [isLoading, setIsLoading] = useState(true); // 로딩 상태 관리
    const [error, setError] = useState(null); // 에러 상태 관리

    useEffect(() => {
        const fetchClosedSpheres = async () => {
            try {
                const token = localStorage.getItem('token'); // 인증 토큰 가져오기
                const data = await getClosedSpheres(token); // MongoDB API 호출
                setClosedSpheres(data); // 상태 업데이트
            } catch (err) {
                setError('데이터를 불러오는 중 오류가 발생했습니다.'); // 에러 메시지 설정
                console.error(err);
            } finally {
                setIsLoading(false); // 로딩 상태 비활성화
            }
        };

        fetchClosedSpheres(); // API 호출
    }, []);

    const handleSphereClick = (id) => {
        router.push(`/sphere/${id}`); // Sphere 상세 페이지로 이동
    };

    if (isLoading) {
        return <div className="text-center py-4">로딩 중...</div>; // 로딩 중 표시
    }

    return (
        <div className="w-full max-w-[500px] mx-auto p-4">
            <h2 className="ml-2 text-xl font-bold mb-3 mt-2">지난 Sphere</h2>
            <div className="flex flex-col space-y-4">
                {closedSpheres.length > 0 ? (
                    closedSpheres.map((sphere) => (
                        <div
                            key={sphere._id} // MongoDB의 ObjectId 사용
                            onClick={() => handleSphereClick(sphere._id)} // _id로 URL 구성
                            className="relative w-full h-48 bg-gray-800 rounded-xl overflow-hidden cursor-pointer"
                        >
                            <Image
                                src={sphere.thumbnail} // MongoDB의 thumbnail 필드 사용
                                alt="Sphere Image"
                                layout="fill"
                                objectFit="cover"
                                className="rounded-lg opacity-80"
                            />
                            <div className="absolute inset-0 p-4 flex flex-col justify-between text-white">
                                <div>
                                    <h3 className="text-lg font-bold">{sphere.title}</h3>
                                    <p className="text-sm">{sphere.subtitle}</p> {/* MongoDB의 subtitle 필드 */}
                                </div>
                                <div className="absolute bottom-0 left-0 w-full bg-black p-4 flex justify-between items-center text-xs rounded-b-lg">
                                    <span className="flex items-center space-x-1">
                                        <Image src="/location-icon.svg" alt="Location Icon" width={12} height={12} />
                                        <span>{sphere.place.name}</span> {/* MongoDB의 place.name 필드 */}
                                    </span>
                                    <span className="flex items-center space-x-1">
                                        <Image src="/calendar-icon.svg" alt="Calendar Icon" width={12} height={12} />
                                        <span>{sphere.firstDate}</span> {/* MongoDB의 firstDate 필드 */}
                                    </span>
                                </div>
                            </div>
                            <span className="absolute top-1 right-1 text-white p-2 rounded-md text-sm font-bold bg-black bg-opacity-75">
                                {'CLOSED'}
                            </span>
                        </div>
                    ))
                ) : (
                    // 'closed' 상태의 스피어가 없을 때 중앙에 메시지 표시
                    <div className="flex items-center justify-center h-48 text-gray-500">
                        아직 지난 스피어가 없습니다.
                    </div>
                )}
            </div>
        </div>
    );
}
