'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { getSphereDetails, cancelReservation, getIsRefundable } from '@/utils/fetcher';
import SphereHeader from '../../../components/SphereHeader';
import SphereDetails from '../../../components/SphereDetails';
import SphereParticipants from '../../../components/SphereParticipants';
import SphereQuestions from '../../../components/SphereQuestions';
import CancelNoticeModal from '../../../components/CancelNoticeModal';
import CancelNoRefundModal from '../../../components/CancelNoRefundModal';

const SphereDetail = ({ params }) => {
    const router = useRouter();
    const { id } = params;
    const [sphere, setSphere] = useState(null);
    const [user, setUser] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태 관리
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showProfileIncompleteModal, setShowProfileIncompleteModal] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [isRefundable, setIsRefundable] = useState(null);
    const [isParticipating, setIsParticipating] = useState(false);
    const [showCancelConfirmation, setShowCancelConfirmation] = useState(false);

    // Fetch Sphere Details
    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const token = localStorage.getItem('token');
                if (token) {
                    setIsLoggedIn(true);
                } else {
                    setIsLoggedIn(false);
                }

                const sphereData = await getSphereDetails(id, token);
                setSphere(sphereData);

                if (token) {
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

                    const isUserParticipating = sphereData.participants.some(
                        (participant) => participant.userId === data.user._id
                    );
                    setIsParticipating(isUserParticipating);
                }
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

    const handleJoinClick = () => {
        if (!isLoggedIn) {
            alert('로그인 후 참여할 수 있습니다.');
            router.push('/signin'); // 로그인 페이지로 리디렉션
            return;
        }

        switch (sphere.canJoin) {
            case 'haveToWriteProfile':
                setShowProfileIncompleteModal(true);
                break;
            case 'haveToSignin':
                alert('로그인 후 이용해주세요.');
                router.push('/signin');
                break;
            case 'canJoin':
                router.push(`/sphere/${id}/join`);
                break;
            default:
                console.error(`Unhandled state for sphere.canJoin: ${sphere.canJoin}`);
                alert('예상치 못한 오류가 발생했습니다. 다시 시도해 주세요.');
        }
    };

    const handleCancelClick = async () => {
        try {
            const { isRefundable } = await getIsRefundable(id); // 서버에서 환불 가능 여부 가져오기
            setIsRefundable(isRefundable);
            setShowCancelModal(true); // 모달 표시
        } catch (error) {
            console.error('Error fetching refundable status:', error);
        }
    };

    const handleCancelNo = () => {
        setShowCancelModal(false);
        setIsRefundable(null);
    };

    const handleCloseModal = () => {
        setShowProfileIncompleteModal(false);
    };

    const handleGoToProfile = () => {
        router.push('/my-profile');
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
                <SphereParticipants
                    participants={sphere.participants}
                    canNotViewNamesAndImages={sphere.canNotViewNamesAndImages}
                />
                <SphereQuestions questions={sphere.questions} />

                {sphere.showJoinOrCancelOrClosed === 'showClosed' ? (
                    <div className="w-full mt-8 py-3 bg-gray-400 text-white font-bold rounded-xl text-center">
                        참여가 마감된 스피어입니다.
                    </div>
                ) : sphere.showJoinOrCancelOrClosed === 'showCancel' ? (
                    <button
                        onClick={handleCancelClick}
                        className="w-full mt-8 py-3 bg-black text-white font-bold rounded-xl"
                    >
                        취소하기
                    </button>
                ) : sphere.showJoinOrCancelOrClosed === 'showAlreadyCanceled' ? (
                    <div className="w-full mt-8 py-3 bg-gray-400 text-white font-bold rounded-xl text-center">
                        한번 취소한 스피어는 참여할 수 없습니다.
                    </div>
                ) : (
                    <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 w-full max-w-[500px] px-4 pb-4 flex justify-center">
                        <button
                            onClick={handleJoinClick}
                            className="w-full py-3 bg-black text-white font-bold rounded-xl"
                        >
                            참여하기
                        </button>
                    </div>
                )}
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
                (isRefundable ? (
                    <CancelNoticeModal onClose={handleCancelNo} id={id} />
                ) : (
                    <CancelNoRefundModal onClose={handleCancelNo} id={id} />
                ))}

            {showCancelConfirmation && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-xl max-w-xs w-full text-center">
                        <p>취소되었습니다.</p>
                        <button
                            onClick={() => {
                                setShowCancelConfirmation(false);
                                router.push(`/sphere/${id}`);
                            }}
                            className="w-full mt-4 py-2 bg-black text-white font-bold rounded-xl"
                        >
                            확인
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SphereDetail;
