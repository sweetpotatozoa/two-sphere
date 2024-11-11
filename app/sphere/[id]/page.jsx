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
import CancelNoticeModal from '../../../components/CancelNoticeModal';
import CancelNoRefundModal from '../../../components/CancelNoRefundModal';

const SphereDetail = ({ params }) => {
    const router = useRouter();
    const { id } = params;
    const sphere = sphereData.find((s) => s.id === parseInt(id));
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [isLessThan24Hours, setIsLessThan24Hours] = useState(false);

    useEffect(() => {
        const now = new Date();
        const firstDate = new Date(sphere.firstDate);
        const timeDifference = firstDate - now;
        setIsLessThan24Hours(timeDifference < 24 * 60 * 60 * 1000);
    }, [sphere.firstDate]);

    if (!sphere) {
        return <p>스피어 정보를 찾을 수 없습니다.</p>;
    }

    // 참여하기 버튼 클릭 핸들러
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
        <div className="max-w-[500px] space-y-8 text-center">
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

                {/* 참여하기 버튼 */}
                <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 w-full max-w-[500px] px-4 pb-4 flex justify-center">
                    <button onClick={handleJoinClick} className="w-full py-3 bg-black text-white font-bold rounded-xl">
                        참여하기
                    </button>
                </div>

                {/* 참여자가 spheres 안의 participants로 등록되어 있는지의 여부에 따라 참여하기/취소하기 버튼 다르게 표시해야 함! api needed */}

                {/* 참여 취소하기 버튼 */}
                {/* {isParticipant && (
                    <div className="w-full px-4 pb-4 flex justify-center">
                        <button
                            onClick={handleCancelClick}
                            className="w-full py-3 bg-black text-white font-bold rounded-xl"
                        >
                            참여 취소하기
                        </button>
                    </div>
                )} */}
            </div>

            {/* Conditional Modal Display */}
            {showCancelModal &&
                (isLessThan24Hours ? (
                    <CancelNoRefundModal onClose={handleCloseModal} id={id} />
                ) : (
                    <CancelNoticeModal onClose={handleCloseModal} id={id} />
                ))}
        </div>
    );
};

export default SphereDetail;

// 이것은 지워도 되는 주석입니다.
