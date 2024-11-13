// app/my-spheres/page.jsx
// fetcher, useEffect, useState로 api 통신 구현 완료
'use client';

import React, { useEffect, useState } from 'react'; // useEffect와 useState 추가
import { getUserSpheres } from '@/utils/fetcher'; // fetcher 함수 추가
import Image from 'next/image';

export default function MySpheresPage() {
    const [spheres, setSpheres] = useState({ openSpheres: [], ongoingSpheres: [], closedSpheres: [] }); // 상태 관리
    const [isLoading, setIsLoading] = useState(true); // 로딩 상태 관리
    const [error, setError] = useState(null); // 에러 상태 관리

    useEffect(() => {
        const fetchMySpheres = async () => {
            try {
                const token = localStorage.getItem('accessToken'); // 인증 토큰 가져오기
                const data = await getUserSpheres(token); // fetcher를 통해 API 데이터 가져오기
                setSpheres(data); // 상태 업데이트
            } catch (err) {
                setError('스피어 정보를 불러오는 데 실패했습니다.'); // 에러 상태 업데이트
                console.error(err);
            } finally {
                setIsLoading(false); // 로딩 상태 종료
            }
        };

        fetchMySpheres();
    }, []);

    if (isLoading) {
        return <div className="text-center py-10">스피어 정보를 불러오는 중입니다...</div>;
    }

    if (error) {
        return <div className="text-center py-10 text-red-500">{error}</div>;
    }

    return (
        <div className="min-h-screen flex flex-col items-center p-8">
            <h1 className="text-2xl font-bold">내 스피어</h1>
            <p className="mt-4">참여 신청된, 참여했던 스피어 목록</p>

            {/* Open Spheres */}
            <section className="w-full mt-6">
                <h2 className="text-lg font-semibold mb-4">Open 상태</h2>
                <div className="grid gap-4">
                    {spheres.openSpheres.map((sphere) => (
                        <div key={sphere._id} className="border p-4 rounded-lg">
                            <h3 className="font-bold">{sphere.title}</h3>
                            <p className="text-sm">{sphere.subtitle}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Ongoing Spheres */}
            <section className="w-full mt-6">
                <h2 className="text-lg font-semibold mb-4">Ongoing 상태</h2>
                <div className="grid gap-4">
                    {spheres.ongoingSpheres.map((sphere) => (
                        <div key={sphere._id} className="border p-4 rounded-lg">
                            <h3 className="font-bold">{sphere.title}</h3>
                            <p className="text-sm">{sphere.subtitle}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Closed Spheres */}
            <section className="w-full mt-6">
                <h2 className="text-lg font-semibold mb-4">Closed 상태</h2>
                <div className="grid gap-4">
                    {spheres.closedSpheres.map((sphere) => (
                        <div key={sphere._id} className="border p-4 rounded-lg">
                            <h3 className="font-bold">{sphere.title}</h3>
                            <p className="text-sm">{sphere.subtitle}</p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
