// app/sphere/[id]/page.jsx
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { sphereData } from '../../data/sphereData';
import locationIcon from '/public/location-icon-black.svg';
import calendarIcon from '/public/calendar-icon-black.svg';

const SphereDetail = ({ params }) => {
    const router = useRouter();
    const { id } = params;
    const sphere = sphereData.find((s) => s.id === parseInt(id));

    if (!sphere) {
        return <p>스피어 정보를 찾을 수 없습니다.</p>;
    }

    // 참여하기 버튼 클릭 핸들러
    const handleJoinClick = () => {
        router.push(`/sphere/${id}/join`);
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
            <div className="max-w-[500px] mx-auto px-4 space-y-8 text-center">
                {/* 섹션 2 */}
                <section className="pb-4 space-y-4">
                    <p className="text-lg pb-4" style={{ whiteSpace: 'pre-line' }}>
                        {sphere.briefIntro}
                    </p>

                    {/* h2와 주소 정보 div를 묶는 래퍼 div */}
                    <div className="border-t border-b border-black mx-auto max-w-[300px] py-4 space-y-2">
                        <h2 className="text-xl font-bold">{sphere.location}</h2>
                        <div className="flex items-center justify-center space-x-2">
                            <Image src={locationIcon} alt="Location Icon" width={16} height={16} />
                            <span>{sphere.address}</span>
                        </div>
                    </div>

                    {sphere.additionalImages.map((img, index) => (
                        <Image
                            key={index}
                            src={img}
                            alt={`Location Image ${index + 1}`}
                            width={500}
                            height={300}
                            className="w-full pt-4"
                        />
                    ))}

                    <p className="text-lg pt-4 pb-4" style={{ whiteSpace: 'pre-line' }}>
                        {sphere.placeStory}
                    </p>
                </section>

                {/* 섹션 3 - 참여자 현황 */}
                <section className="pb-28 pb-4 space-y-4">
                    {/* h2와 p를 묶는 래퍼 div */}
                    <div className="border-t border-b border-black mx-auto max-w-[300px] py-4 space-y-2">
                        <h2 className="text-xl font-bold">참여자 현황</h2>
                        <p className="text-sm text-gray-600">버튼을 눌러 프로필을 조회해보세요</p>
                    </div>
                    <div className="relative w-32 h-32 mx-auto">
                        {Array.from({ length: 4 }).map((_, index) => (
                            <div
                                key={index}
                                className={`absolute w-20 h-20 flex items-center justify-center rounded-full border-2 ${
                                    sphere.participants[index] ? 'bg-black text-white' : 'bg-gray-300 text-gray-400'
                                }`}
                                style={{
                                    top: index === 0 ? '0%' : index === 2 ? '100%' : '50%',
                                    left: index === 1 ? '0%' : index === 3 ? '100%' : '50%',
                                    transform: 'translate(-50%, 0%)',
                                }}
                            >
                                {sphere.participants[index] ? (
                                    <span className="text-center text-sm font-bold">{sphere.participants[index]}</span>
                                ) : (
                                    <span>&nbsp;</span>
                                )}
                            </div>
                        ))}
                    </div>
                </section>

                {/* 섹션 4 */}
                <section className="pb-6 space-y-4">
                    {/* h2 래퍼 div */}
                    <div className="border-t border-b border-black mx-auto max-w-[300px] py-4 space-y-2">
                        <h2 className="text-xl font-bold">Sphere Contents</h2>
                    </div>
                    <ul className="list-disc ml-6 space-y-1 text-left inline-block">
                        {sphere.questions.map((question, index) => (
                            <li key={index}>{question}</li>
                        ))}
                    </ul>
                </section>

                {/* 참여하기 버튼 */}
                <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 w-full max-w-[500px] px-4 pb-4 flex justify-center">
                    <button onClick={handleJoinClick} className="w-full py-3 bg-black text-white font-bold rounded-xl">
                        참여하기
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SphereDetail;
