'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { sphereData } from '../../../data/sphereData';
import SphereHeader from '../../../../components/SphereHeader';
import SphereDetails from '../../../../components/SphereDetails';
import SphereParticipants from '../../../../components/SphereParticipants';
import SphereContents from '../../../../components/SphereContents';
import Cancel1 from '../../../../components/Cancel1';
import Cancel2 from '../../../../components/Cancel2';

const SphereDetail = ({ params }) => {
    const router = useRouter();
    const { id } = params;
    const sphere = sphereData.find((s) => s.id === parseInt(id));
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [isLessThan24Hours, setIsLessThan24Hours] = useState(false);

    if (!sphere) {
        return <p>스피어 정보를 찾을 수 없습니다.</p>;
    }

    useEffect(() => {
        const now = new Date();
        const firstDate = new Date(sphere.firstDate);
        const timeDifference = firstDate - now;
        setIsLessThan24Hours(timeDifference < 24 * 60 * 60 * 1000);
    }, [sphere.firstDate]);

    const handleJoinClick = () => {
        router.push(`/sphere/${id}/join`);
    };

    const handleCancelClick = () => {
        setShowCancelModal(true);
    };

    const handleCloseModal = () => {
        setShowCancelModal(false);
    };

    return (
        <div className="max-w-[500px] space-y-8 text-center mx-auto">
            <div className="w-full max-w-[500px] h-[100px] overflow-hidden">
                <Image
                    src={sphere.image}
                    alt="Sphere Image"
                    width={500}
                    height={300}
                    className="w-full object-cover object-center"
                />
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

                {/* 참여 취소하기 버튼 at the bottom of the content */}
                <div className="w-full px-4 pb-4 flex justify-center">
                    <button
                        onClick={handleCancelClick}
                        className="w-full py-3 bg-black text-white font-bold rounded-xl"
                    >
                        참여 취소하기
                    </button>
                </div>
            </div>

            {/* Conditional Modal Display */}
            {showCancelModal &&
                (isLessThan24Hours ? (
                    <Cancel2 onClose={handleCloseModal} id={id} />
                ) : (
                    <Cancel1 onClose={handleCloseModal} id={id} />
                ))}
        </div>
    );
};

export default SphereDetail;
