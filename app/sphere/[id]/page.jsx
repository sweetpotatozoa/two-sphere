'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { getSphereDetails } from '@/utils/fetcher';
import SphereHeader from '../../../components/SphereHeader';
import SphereDetails from '../../../components/SphereDetails';
import SphereParticipants from '../../../components/SphereParticipants';
import SphereQuestions from '../../../components/SphereQuestions';
import CancelNoticeModal from '../../../components/CancelNoticeModal';
import CancelNoRefundModal from '../../../components/CancelNoRefundModal';

const SphereDetail = ({ params }) => {
    const router = useRouter();
    const { id } = params;
    const [sphere, setSphere] = useState(null); // 스피어 상태
    const [user, setUser] = useState(null); // 사용자 상태 추가
    const [showProfileIncompleteModal, setShowProfileIncompleteModal] = useState(false); // 모달 상태 추가
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [isLessThan24Hours, setIsLessThan24Hours] = useState(false);
    const [error, setError] = useState(null); // 에러 상태 추가
    const [isLoading, setIsLoading] = useState(true); // 로딩 상태 추가

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) throw new Error('Access token is missing.');

                const sphereData = await getSphereDetails(id, token);
                setSphere(sphereData);

                const response = await fetch('/api/my-profile', {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    cache: 'no-store',
                });
                if (!response.ok) {
                    throw new Error(`Failed to fetch user data: ${response.statusText}`);
                }
                const data = await response.json();
                setUser(data.user);

                const now = new Date();
                const firstDate = new Date(sphereData.firstDate);
                const timeDifference = firstDate - now;
                setIsLessThan24Hours(timeDifference < 24 * 60 * 60 * 1000);
            } catch (err) {
                setError(`스피어 정보를 불러오는 데 실패했습니다: ${err.message}`);
                console.error('Detailed error:', err);
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

    const isProfileComplete = () => {
        // 프로필이 완성되었는지 확인
        return user?.career && user.answers?.every((answer) => answer);
    };

    const handleJoinClick = () => {
        const token = localStorage.getItem('token');

        if (!token) {
            // 로그인되지 않은 경우, 로그인 페이지로 이동하며 원래 경로로 리디렉션 설정
            router.push(`/signin?redirect=/sphere/${id}/join`);
        } else if (!isProfileComplete()) {
            // 로그인은 되었으나 프로필이 완성되지 않은 경우, 모달을 표시
            setShowProfileIncompleteModal(true);
        } else {
            // 로그인 및 프로필이 완성된 경우, 참여 페이지로 이동
            router.push(`/sphere/${id}/join`);
        }
    };

    const handleCancelYes = () => {
        setShowCancelModal(true);
    };

    const handleCancelNo = () => {
        setShowCancelModal(false);
    };

    const handleCloseModal = () => {
        setShowProfileIncompleteModal(false);
    };

    const handleGoToProfile = () => {
        router.push('/my-profile'); // 프로필 페이지로 이동
    };

    return (
        <div className="max-w-[500px] space-y-8 text-center">
            <div className="w-full max-w-[500px] h-[100px] overflow-hidden">
                <Image
                    src={sphere.thumbnail}
                    alt="Sphere Image"
                    width={500}
                    height={300}
                    className="w-full object-cover object-center"
                />
            </div>
            <SphereHeader
                title={sphere.title}
                subtitle={sphere.subtitle}
                place={sphere.place}
                firstDate={sphere.firstDate}
            />

            <div className="max-w-[500px] mx-auto px-4 space-y-8 text-center">
                <SphereDetails
                    description={sphere.description}
                    place={sphere.place}
                    address={sphere.address}
                    subImage1={sphere.subImage1}
                    subImage2={sphere.subImage2}
                    placeStory={sphere.placeStory}
                />
                <SphereParticipants participants={sphere.participants} />
                <SphereQuestions questions={sphere.questions} />

                <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 w-full max-w-[500px] px-4 pb-4 flex justify-center">
                    <button onClick={handleJoinClick} className="w-full py-3 bg-black text-white font-bold rounded-xl">
                        참여하기
                    </button>
                </div>
            </div>

            {showProfileIncompleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-xl max-w-xs w-full space-y-4 text-center">
                        <p>
                            프로필을 완성해야 참여할 수 있습니다.
                            <br />
                            프로필 페이지로 이동하시겠습니까?
                        </p>
                        <div className="space-x-4">
                            <button
                                onClick={handleGoToProfile}
                                className="w-32 py-2 bg-black text-white font-bold rounded-xl"
                            >
                                확인
                            </button>
                            <button
                                onClick={handleCloseModal}
                                className="w-32 py-2 bg-gray-200 text-black font-bold rounded-xl"
                            >
                                취소
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showCancelModal &&
                (isLessThan24Hours ? (
                    <CancelNoRefundModal onClose={handleCancelNo} id={id} />
                ) : (
                    <CancelNoticeModal onClose={handleCancelNo} id={id} />
                ))}
        </div>
    );
};

export default SphereDetail;
