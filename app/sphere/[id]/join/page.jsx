// app/sphere/[id]/join/page.jsx
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import SphereHeader from '../../../../components/SphereHeader';
import { getSphereDetails } from '@/utils/fetcher';
import { joinSphere } from '@/utils/fetcher'; // API 호출 함수 추가
import jwt from 'jsonwebtoken';

const JoinPage = ({ params }) => {
    const router = useRouter();
    const { id } = params;

    const [sphere, setSphere] = useState(null); // MongoDB에서 가져온 스피어 데이터 상태
    const [requestLeader, setRequestLeader] = useState(null); // 리더 희망 여부 상태
    const [isConfirmed, setIsConfirmed] = useState(false); // 확인 체크박스 상태
    const [error, setError] = useState(null); // 에러 상태 추가

    useEffect(() => {
        const fetchSphereData = async () => {
            try {
                const data = await getSphereDetails(id); // fetcher.js의 getSphereDetails 함수 호출
                setSphere(data); // MongoDB에서 가져온 스피어 데이터 설정
            } catch (err) {
                console.error('Failed to fetch sphere data:', err.message);
                setError('스피어 정보를 불러오는 데 실패했습니다.');
            }
        };

        fetchSphereData();
    }, [id]);

    // 참여하기 버튼 클릭 핸들러
    const handleJoinClick = async () => {
        if (requestLeader !== null && isConfirmed) {
            try {
                await joinSphere(id, requestLeader); // 수정된 함수 호출
                router.push(`/sphere/${id}/joined`); // 참여 완료 페이지로 이동
            } catch (err) {
                console.error('스피어 참여 실패:', err.message);
                setError('스피어 참여에 실패했습니다. 다시 시도해주세요.');
            }
        }
    };

    if (!sphere) {
        return <p className="text-center">스피어 데이터를 불러오는 중입니다...</p>;
    }

    return (
        <div className="max-w-[500px] space-y-8 text-center">
            <div className="w-full max-w-[500px] h-[150px] overflow-hidden">
                <Image
                    src={sphere.thumbnail} // MongoDB 데이터 사용
                    alt="Sphere Image"
                    width={500}
                    height={300}
                    className="w-full object-cover"
                />
            </div>
            <SphereHeader
                title={sphere.title}
                subtitle={sphere.subtitle} // MongoDB 데이터 사용
                place={sphere.place} // MongoDB 데이터 사용
                firstDate={sphere.firstDate} // MongoDB 데이터 사용
            />

            {/* 리더 희망 여부 */}
            <section className="border-b border-black mx-auto max-w-[450px] pb-8 space-y-4">
                <h2 className="text-xl font-bold">*Sphere 리더를 희망하시나요?</h2>
                <div className="flex justify-center space-x-4">
                    <button
                        onClick={() => setRequestLeader(true)}
                        className={`w-32 py-2 border border-black font-bold rounded-xl ${
                            requestLeader === true ? 'bg-black text-white' : 'bg-white text-black'
                        }`}
                    >
                        예
                    </button>
                    <button
                        onClick={() => setRequestLeader(false)}
                        className={`w-32 py-2 border border-black font-bold rounded-xl ${
                            requestLeader === false ? 'bg-black text-white' : 'bg-white text-black'
                        }`}
                    >
                        아니요
                    </button>
                </div>
                <p className="text-sm text-gray-600">
                    * Sphere 리더는 해당 Sphere의 진행을 주도적으로 맡는 참여자입니다.
                </p>
            </section>

            {/* 안내사항 */}
            <section className="pb-4 space-y-4">
                <h2 className="text-xl font-bold">안내사항</h2>
                <div className="mx-auto max-w-[360px] px-8 py-8 space-y-2 border border-black rounded-xl">
                    <p className="text-sm">
                        하나의 Sphere는 총 2회의 모임으로 진행됩니다. <br />
                        2회 모임 참석은 필수입니다. <br />
                        무단으로 모임에 참여하지 않으실 경우 <br />
                        참여하지 않은 모임에 대한 환불을 해드리지 않습니다.
                    </p>
                </div>
                <div className="flex items-center justify-center space-x-2">
                    <input
                        type="checkbox"
                        checked={isConfirmed}
                        onChange={(e) => setIsConfirmed(e.target.checked)}
                        className="cursor-pointer"
                    />
                    <span className="text-sm">확인했습니다</span>
                </div>
            </section>

            {/* 에러 메시지 표시 */}
            {error && <p className="text-red-500">{error}</p>}

            {/* 참여하기 버튼 */}
            <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 w-full max-w-[500px] px-4 pb-4 flex justify-center">
                <button
                    onClick={handleJoinClick}
                    disabled={requestLeader === null || !isConfirmed}
                    className={`w-full py-3 font-bold rounded-xl ${
                        requestLeader === null || !isConfirmed
                            ? 'border border-black bg-white text-black cursor-not-allowed'
                            : 'bg-black text-white'
                    }`}
                >
                    참여하기
                </button>
            </div>
        </div>
    );
};

export default JoinPage;
