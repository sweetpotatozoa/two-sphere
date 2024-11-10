// app/sphere/[id]/join/page.jsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { sphereData } from '../../../data/sphereData';
import locationIcon from '/public/location-icon-black.svg';
import calendarIcon from '/public/calendar-icon-black.svg';

const JoinPage = ({ params }) => {
    const router = useRouter();
    const { id } = params;
    const sphere = sphereData.find((s) => s.id === parseInt(id));

    const [isLeader, setIsLeader] = useState(null); // 리더 희망 여부 상태
    const [isConfirmed, setIsConfirmed] = useState(false); // 확인 체크박스 상태

    if (!sphere) {
        return <p>스피어 정보를 찾을 수 없습니다.</p>;
    }

    // 참여하기 버튼 클릭 핸들러
    const handleJoinClick = () => {
        if (isLeader !== null && isConfirmed) {
            router.push(`/sphere/${id}/joined`);
        }
    };

    return (
        <div className="max-w-[500px] space-y-8 text-center">
            <div className="w-full max-w-[500px] h-[150px] overflow-hidden">
                <Image src={sphere.image} alt="Sphere Image" width={500} height={300} className="w-full object-cover" />
            </div>

            {/* 섹션 1 */}
            <section className="border-b border-black pb-8 space-y-4">
                <h1 className="text-2xl font-bold">{sphere.title}</h1>
                <p>{sphere.description}</p>
                <div className="flex items-center justify-center space-x-2">
                    <Image src={locationIcon} alt="Location Icon" width={16} height={16} />
                    <span>{sphere.location}</span>
                    <Image src={calendarIcon} alt="Calendar Icon" width={16} height={16} />
                    <span>{sphere.date}</span>
                </div>
            </section>

            {/* 리더 희망 여부 */}
            <section className="border-b border-black mx-auto max-w-[400px] space-y-4">
                <h2 className="text-xl font-bold">*Sphere 리더를 희망하시나요?</h2>
                <div className="flex justify-center space-x-4">
                    <button
                        onClick={() => setIsLeader(true)}
                        className={`w-32 py-2 border border-black font-bold rounded-xl ${
                            isLeader === true ? 'bg-black text-white' : 'bg-white text-black'
                        }`}
                    >
                        예
                    </button>
                    <button
                        onClick={() => setIsLeader(false)}
                        className={`w-32 py-2 border border-black font-bold rounded-xl ${
                            isLeader === false ? 'bg-black text-white' : 'bg-white text-black'
                        }`}
                    >
                        아니요
                    </button>
                </div>
                <p className="text-sm text-gray-600 pb-8">
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

            {/* 참여하기 버튼 */}
            <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 w-full max-w-[500px] px-4 pb-4 flex justify-center">
                <button
                    onClick={handleJoinClick}
                    disabled={isLeader === null || !isConfirmed}
                    className={`w-full py-3 font-bold rounded-xl ${
                        isLeader === null || !isConfirmed
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
