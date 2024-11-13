// app/my-spheres/page.jsx
'use client';

import React, { useEffect, useState } from 'react';
import { getUserSpheres } from '@/utils/fetcher';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function MySpheresPage() {
    const router = useRouter();
    const [spheres, setSpheres] = useState({ openSpheres: [], ongoingSpheres: [], closedSpheres: [] });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMySpheres = async () => {
            try {
                const token = localStorage.getItem('token');
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
    }, []);

    const handleSphereClick = (id) => {
        router.push(`/sphere/${id}`);
    };

    if (isLoading) {
        return <div className="text-center py-10">스피어 정보를 불러오는 중입니다...</div>;
    }

    if (error) {
        return <div className="text-center py-10 text-red-500">{error}</div>;
    }

    const renderSphereCard = (sphere) => (
        <div
            key={sphere._id}
            onClick={() => handleSphereClick(sphere._id)}
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
                        <span>{sphere.firstDate}</span>
                    </span>
                </div>
            </div>
            <span className="absolute top-1 right-1 text-white p-2 rounded-md text-sm font-bold bg-black bg-opacity-75">
                D-{Math.ceil((new Date(sphere.firstDate) - new Date()) / (1000 * 60 * 60 * 24))}
            </span>
        </div>
    );

    return (
        <div className="min-h-screen flex flex-col items-center p-8">
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
                            현재 참여 신청한 스피어가 없습니다.
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
                            현재 진행 중인 스피어가 없습니다.
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
                            현재 완료된 스피어가 없습니다.
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
