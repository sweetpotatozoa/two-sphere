'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { getSphereDetails } from '@/utils/fetcher';
import SphereHeader from '../../../components/SphereHeader';
import SphereDetails from '../../../components/SphereDetails';
import SphereParticipants from '../../../components/SphereParticipants';
import SphereContents from '../../../components/SphereContents';
import CancelNoticeModal from '../../../components/CancelNoticeModal';
import CancelNoRefundModal from '../../../components/CancelNoRefundModal';

const SphereDetail = ({ params }) => {
    const router = useRouter();
    const { id } = params;
    const [sphere, setSphere] = useState(null); // 스피어 상태
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [isLessThan24Hours, setIsLessThan24Hours] = useState(false);
    const [error, setError] = useState(null); // 에러 상태 추가
    const [isLoading, setIsLoading] = useState(true); // 로딩 상태 추가

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const token = localStorage.getItem('accessToken'); // 사용자 인증 토큰 가져오기
                const sphereData = await getSphereDetails(id, token); // API 호출
                setSphere(sphereData); // 스피어 상태 업데이트

                // 24시간 이내 여부 확인
                const now = new Date();
                const firstDate = new Date(sphereData.firstDate);
                const timeDifference = firstDate - now;
                setIsLessThan24Hours(timeDifference < 24 * 60 * 60 * 1000);
            } catch (err) {
                setError('스피어 정보를 불러오는 데 실패했습니다.');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDetails();
    }, [id]);

    if (isLoading) {
        return <div className="text-center py-10">스피어 정보를 불러오는 중입니다...</div>;
    }

    if (error) {
        return <div className="text-center py-10 text-red-500">{error}</div>;
    }

    if (!sphere) {
        return <p>스피어 정보를 찾을 수 없습니다.</p>;
    }

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

                <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 w-full max-w-[500px] px-4 pb-4 flex justify-center">
                    <button onClick={handleJoinClick} className="w-full py-3 bg-black text-white font-bold rounded-xl">
                        참여하기
                    </button>
                </div>
            </div>

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
