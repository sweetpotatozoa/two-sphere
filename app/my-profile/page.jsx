// app/my-profile/page.jsx
'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';

export default function MyProfilePage() {
    const router = useRouter();
    const { logout } = useAuth();
    const [user, setUser] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch('/api/my-profile'); // 서버에서 사용자 데이터를 가져옴
                if (response.ok) {
                    const data = await response.json();
                    setUser(data);
                }
            } catch (error) {
                console.error('Failed to fetch user data:', error);
            }
        };
        fetchUserData();
    }, []);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const handleLogout = () => {
        logout();
        router.push('/');
    };

    if (!user) return <p>Loading...</p>;

    return (
        <div className="max-w-[500px] mx-auto px-4 py-8 text-center ">
            {/* 프로필 이미지 */}
            <div className="flex justify-center mb-4">
                <div
                    className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center"
                    onClick={openModal}
                >
                    <Image src="/profile-icon-black.svg" alt="User Icon" width={48} height={48} />
                </div>
            </div>

            {/* 기본 정보 */}
            <div className="flex justify-center items-center">
                <h1 className="text-2xl font-bold">{user.name || '로그인 안 됨!'}</h1>
                <button onClick={handleLogout} className="flex items-center justify-center py-1.5 px-4">
                    <Image src="/logout-icon.svg" alt="Logout" width={20} height={20} />
                </button>
            </div>
            <p className="text-gray-600 mt-2">{user.career || '한 줄 커리어'}</p>

            {/* 질문 목록 */}
            <div className="border-t border-gray-300 my-4"></div>

            {/* 개별 질문 섹션 */}
            {user.answers.map((answer, index) => (
                <div key={index} className="text-left mb-6">
                    <h2 className="ml-4 text-md font-bold">
                        Q{index + 1}. {questions[index]}
                    </h2>
                    <p className="text-gray-600 mt-2">{answer || '아직 답변을 작성하지 않았습니다.'}</p>
                    <div className="border-b border-gray-300 mt-4"></div>
                </div>
            ))}

            {/* 프로필 수정하기 버튼 */}
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
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-xl max-w-xs w-full space-y-4 text-center">
                        <p>
                            프로필 사진 등록을 원하시는 경우,
                            <br /> 카카오톡으로 사진을 보내주세요.
                        </p>
                        <button onClick={closeModal} className="bg-black text-white px-4 py-2 rounded-xl">
                            닫기
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

const questions = [
    '현재 어떤 일을 하고 있는지, 어떤 일상을 보내고 있는지 알려주세요.',
    '나를 가장 잘 표현하는 세 가지 단어는 무엇인가요?',
    '가장 몰입하는 순간은 언제인가요?',
    '인생에서 꼭 이루고 싶은 목표가 있다면 무엇인가요?',
    '다른 사람들에게 어떻게 기억되고 싶나요?',
];
