'use client';
/* eslint-disable react/no-unescaped-entities */

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function MyProfilePage() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태 추가

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem('token'); // 로컬스토리지에서 토큰 가져오기
            if (!token) {
                router.push('/signin'); // 토큰 없으면 로그인 페이지로 이동
                return;
            }
            try {
                const response = await fetch('/api/my-profile', {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`, // 토큰을 Authorization 헤더에 추가
                    },
                    cache: 'no-store',
                });
                if (response.ok) {
                    const data = await response.json();
                    setUser(data.user);
                } else {
                    console.error('Failed to fetch user data:', response.status);
                }
            } catch (error) {
                console.error('Failed to fetch user data:', error);
            }
        };
        fetchUserData();
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem('token'); // 토큰 제거
        localStorage.setItem('logoutMessage', 'true'); // 로그아웃 메시지 상태 저장
        router.push('/'); // 홈으로 즉시 이동
    };

    const openModal = () => setIsModalOpen(true); // 모달 열기 함수
    const closeModal = () => setIsModalOpen(false); // 모달 닫기 함수

    if (!user) return <p className="flex flex-col items-center mt-12">사용자 데이터를 불러오는 중입니다.</p>;

    return (
        <div className="max-w-[500px] mx-auto px-4 py-8 text-center ">
            {/* 프로필 이미지 */}
            <div className="flex justify-center mb-4">
                <div
                    className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center cursor-pointer"
                    onClick={openModal} // 클릭 시 모달 열기
                >
                    <Image
                        src={user.image || '/profile-icon-black.svg'} // 조건부 렌더링
                        alt="User Profile"
                        width={48}
                        height={48}
                        className="size-full rounded-full"
                    />
                </div>
            </div>
            <div className="flex justify-center items-center">
                <h1 className="text-2xl font-bold">{user.name || '로그인 안 됨!'}</h1>
                <button onClick={handleLogout} className="flex items-center justify-center py-1.5 px-4">
                    <Image src="/logout-icon.svg" alt="Logout" width={20} height={20} />
                </button>
            </div>
            <p className="text-gray-600 mt-2">{user.career || '아직 한 줄 커리어가 없습니다.'}</p>

            <div className="border-t border-gray-300 my-4"></div>

            {questions.map((question, index) => (
                <div key={index} className="text-left mb-6">
                    <h2 className="ml-4 text-md font-bold">
                        Q{index + 1}. {question}
                    </h2>
                    <p className="text-gray-600 ml-4 mt-2">
                        {Array.isArray(user.answers) && user.answers[index]
                            ? user.answers[index]
                            : '아직 답변을 작성하지 않았습니다.'}
                    </p>
                    <div className="border-b border-gray-300 mt-4"></div>
                </div>
            ))}

            <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 w-full max-w-[500px] px-4 pb-4 flex justify-center">
                <button
                    onClick={() => router.push('/my-profile/edit')}
                    className="w-full py-3 bg-black text-white font-bold rounded-xl"
                >
                    프로필 수정하기
                </button>
            </div>

            {/* 모달 */}
            {isModalOpen && (
                <div className="fixed top-0 left-1/2 transform -translate-x-1/2 w-full max-w-[500px] h-[calc(100vh-3rem)] z-40 flex">
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-xl max-w-xs w-full space-y-4 text-center">
                            <p>
                                프로필 사진 등록을 원하시는 경우,
                                <br /> 카카오톡 '투스피어'로 사진을 보내주세요.
                            </p>
                            <button onClick={closeModal} className="bg-black text-white px-4 py-2 rounded-xl">
                                닫기
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export const questions = [
    '현재 어떤 일을 하고 있는지, 어떤 일상을 보내고 있는지 알려주세요.',
    '나를 가장 잘 표현하는 세 가지 단어는 무엇인가요?',
    '가장 몰입하는 순간은 언제인가요?',
    '인생에서 꼭 이루고 싶은 목표가 있다면 무엇인가요?',
    '다른 사람들에게 어떻게 기억되고 싶나요?',
];
