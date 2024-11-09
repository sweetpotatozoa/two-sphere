// app/sphere/[id]/joined/page.jsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { sphereData } from '../../../data/sphereData';
import locationIcon from '/public/location-icon-black.svg';
import calendarIcon from '/public/calendar-icon-black.svg';

const JoinedPage = ({ params }) => {
    const router = useRouter();
    const { id } = params;
    const sphere = sphereData.find((s) => s.id === parseInt(id));

    if (!sphere) {
        return <p>스피어 정보를 찾을 수 없습니다.</p>;
    }

    // 참여하기 버튼 클릭 핸들러
    const handleOkayClick = () => {
        router.push(`/my-spheres`);
    };

    return (
        <div className="max-w-[500px] space-y-8 text-center mx-auto px-4">
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

            <section className="pb-4 space-y-4">
                <h2 className="text-xl font-bold">참여 신청이 완료되었습니다!</h2>
                <p className="text-sm mx-auto max-w-[300px] py-4 space-y-2 border border-black rounded-lg">
                    참여비: 300,000원 <br />
                    계좌 : 토스 112119114111 <br />
                </p>
                <p className="text-sm text-gray-600">
                    위 계좌로 참여비 입금 시 참여 확정되며
                    <br />
                    안내 문자를 보내드립니다.
                </p>
            </section>

            {/* 확인 버튼 */}
            <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 w-full max-w-[500px] px-4 pb-4 flex justify-center">
                <button onClick={handleOkayClick} className="w-full py-3 bg-black text-white font-bold rounded-xl">
                    확인
                </button>
            </div>
        </div>
    );
};

export default JoinedPage;
