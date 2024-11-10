// app/sphere/[id]/page.jsx
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { sphereData } from '../../data/sphereData';
import SphereHeader from '../../../components/SphereHeader';
import SphereDetails from '../../../components/SphereDetails';
import SphereParticipants from '../../../components/SphereParticipants';
import SphereContents from '../../../components/SphereContents';

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
            <SphereHeader
                title={sphere.title}
                description={sphere.description}
                location={sphere.location}
                date={sphere.date}
            />

            <div className="max-w-[500px] mx-auto px-4 space-y-8 text-center">
                <SphereDetails
                    briefIntro={sphere.briefIntro}
                    location={sphere.location}
                    address={sphere.address}
                    additionalImages={sphere.additionalImages}
                    placeStory={sphere.placeStory}
                />
                <SphereParticipants participants={sphere.participants} />
                <SphereContents questions={sphere.questions} />

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
