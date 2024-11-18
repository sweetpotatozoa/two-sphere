'use client';

export const dynamic = 'force-dynamic';

import React, { useEffect, useState } from 'react';
import { getUserSpheres } from '@/utils/fetcher';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function MySpheresPage() {
    const router = useRouter();
    const [spheres, setSpheres] = useState({ openSpheres: [], ongoingSpheres: [], closedSpheres: [] });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedSphere, setSelectedSphere] = useState(null); // 선택된 Sphere 저장

    // 로그인 상태 확인 후, 로그인되지 않으면 로그인 페이지로 리디렉션
    useEffect(() => {
        const token = localStorage.getItem('token');

        if (!token) {
            alert('로그인 후 이용 가능합니다.');
            router.push('/signin'); // 로그인하지 않으면 로그인 페이지로 리디렉션
            return;
        }

        const fetchMySpheres = async () => {
            try {
                const data = await getUserSpheres(token);
                setSpheres(data);
            } catch (err) {
                setError('스피어 정보를 불러오는 데 실패했습니다.');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMySpheres();
    }, [router]); // `router`는 `useEffect` 의존성 배열에 추가

    const handleSphereClick = (sphere) => {
        if (sphere.hasUnpaidStatus) {
            // unpaid 상태인 경우 모달 UI 표시
            setSelectedSphere(sphere);
        } else {
            // 기본 라우팅
            router.push(`/sphere/${sphere._id}`);
        }
    };

    const handleOkayClick = () => {
        if (selectedSphere) {
            // Sphere 상세 페이지로 이동
            router.push(`/sphere/${selectedSphere._id}`);
        }
    };

    const renderSphereCard = (sphere) => (
        <div
            key={sphere._id}
            onClick={() => handleSphereClick(sphere)}
            className="relative w-full h-48 bg-gray-800 rounded-xl overflow-hidden cursor-pointer"
        >
            <Image
                src={sphere.thumbnail}
                alt="Sphere Image"
                layout="fill"
                objectFit="cover"
                className="rounded-lg opacity-80"
            />
            <div className="absolute inset-0 p-4 flex flex-col justify-between text-white">
                <div>
                    <h3 className="text-lg font-bold">{sphere.title}</h3>
                    <p className="text-sm">{sphere.subtitle}</p>
                </div>
                <div className="absolute bottom-0 left-0 w-full bg-black p-4 flex justify-between items-center text-xs rounded-b-lg">
                    <span className="flex items-center space-x-1">
                        <Image src="/location-icon.svg" alt="Location Icon" width={12} height={12} />
                        <span>{sphere.place.name}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                        <Image src="/calendar-icon.svg" alt="Calendar Icon" width={12} height={12} />
                        <span>
                            {sphere.firstDate} {sphere.time}
                        </span>
                    </span>
                </div>
            </div>
            <span className="absolute top-1 right-1 text-white p-2 rounded-md text-sm font-bold bg-black bg-opacity-75">
                {sphere.remainingDays === 0 ? 'D-DAY' : `D-${sphere.remainingDays}`}
            </span>
        </div>
    );

    if (isLoading) {
        return <div className="text-center py-10">스피어 정보를 불러오는 중입니다...</div>;
    }

    if (error) {
        return <div className="text-center py-10 text-red-500">{error}</div>;
    }

    return (
        <div className="w-full min-h-screen flex flex-col items-center p-8">
            <h1 className="text-2xl font-bold">내 스피어</h1>
            <p className="mt-4">내가 참여 신청한, 진행 중인, 참여했던 스피어를 확인하세요.</p>

            {/* Open Spheres */}
            <section className="w-full max-w-[500px] mt-6">
                <h2 className="text-lg font-semibold mb-4">참여 신청한 스피어</h2>
                <div className="flex flex-col space-y-2">
                    {spheres.openSpheres.length > 0 ? (
                        spheres.openSpheres.map(renderSphereCard)
                    ) : (
                        <div className="flex items-center justify-center h-48 text-gray-500">
                            참여 신청한 스피어가 없습니다.
                        </div>
                    )}
                </div>
            </section>

            {/* Ongoing Spheres */}
            <section className="w-full max-w-[500px] mt-6">
                <h2 className="text-lg font-semibold mb-4">진행 중인 스피어</h2>
                <div className="flex flex-col space-y-2">
                    {spheres.ongoingSpheres.length > 0 ? (
                        spheres.ongoingSpheres.map(renderSphereCard)
                    ) : (
                        <div className="flex items-center justify-center h-48 text-gray-500">
                            진행 중인 스피어가 없습니다.
                        </div>
                    )}
                </div>
            </section>

            {/* Closed Spheres */}
            <section className="w-full max-w-[500px] mt-6">
                <h2 className="text-lg font-semibold mb-4">참여 완료한 스피어</h2>
                <div className="flex flex-col space-y-2">
                    {spheres.closedSpheres.length > 0 ? (
                        spheres.closedSpheres.map(renderSphereCard)
                    ) : (
                        <div className="flex items-center justify-center h-48 text-gray-500">
                            참여 완료한 스피어가 없습니다.
                        </div>
                    )}
                </div>
            </section>

            {/* Modal for unpaid spheres */}
            {selectedSphere && selectedSphere.hasUnpaidStatus && (
                <div className="fixed top-0 left-1/2 transform -translate-x-1/2 w-full max-w-[500px] h-[calc(100vh-3rem)] z-40 flex">
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg space-y-4 w-[90%] max-w-[400px]">
                            <h2 className="text-xl font-bold text-center">입금 정보</h2>
                            <p className="text-sm mx-auto max-w-[300px] py-4 space-y-2 border border-black rounded-xl text-center">
                                참여비: 300,000원 <br />
                                계좌 : 토스 112119114111 <br />
                            </p>

                            <p className="text-sm text-gray-600 text-center">
                                위 계좌로 참여비 입금 시 참여 확정되며 안내 문자를 보내드립니다.
                                <br />
                                (참여비 입금이 확인되면 스피어 참여자의 상세 정보 조회가
                                <br />
                                가능합니다.)
                            </p>

                            <button
                                onClick={handleOkayClick}
                                className="w-full py-3 bg-black text-white font-bold rounded-xl"
                            >
                                확인
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
