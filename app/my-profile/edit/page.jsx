// app/my-profile/edit/page.jsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import Image from 'next/image';

export default function EditProfilePage() {
    const router = useRouter();
    const { user } = useAuth();

    const [career, setCareer] = useState(user?.career || '');
    const [answers, setAnswers] = useState(user?.answers || Array(5).fill(''));

    // 모달 표시 상태 추가
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleAnswerChange = (index, value) => {
        const updatedAnswers = [...answers];
        updatedAnswers[index] = value;
        setAnswers(updatedAnswers);
    };

    const handleSave = () => {
        console.log('저장:', { career, answers });
        router.push('/my-profile');
    };

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    return (
        <div className="max-w-[500px] mx-auto px-4 py-8">
            {/* 프로필 이미지 */}
            <div className="text-center mb-4">
                <div className="flex justify-center mb-4">
                    <div
                        className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center cursor-pointer"
                        onClick={openModal}
                    >
                        <Image src="/profile-icon-black.svg" alt="User Icon" width={48} height={48} />
                    </div>
                </div>
                <h1 className="text-2xl font-bold">{user?.name || '로그인 안 됨!'}</h1>
            </div>

            {/* 커리어 수정 */}
            <div className="mb-6">
                <label className="ml-4 block text-md font-bold mb-2">한 줄 커리어</label>
                <input
                    type="text"
                    value={career}
                    onChange={(e) => setCareer(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-4 py-2 outline-none"
                    placeholder="커리어를 입력하세요"
                />
            </div>

            {/* 질문과 답변 수정 */}
            {[
                '현재 어떤 일을 하고 있는지, 어떤 일상을 보내고 있는지 알려주세요.',
                '나를 가장 잘 표현하는 세 가지 단어는 무엇인가요?',
                '가장 몰입하는 순간은 언제인가요?',
                '인생에서 꼭 이루고 싶은 목표가 있다면 무엇인가요?',
                '다른 사람들에게 어떻게 기억되고 싶나요?',
            ].map((question, index) => (
                <div key={index} className="mb-8">
                    <label className="ml-4 block text-md font-bold mb-2">{`Q${index + 1}. ${question}`}</label>
                    <input
                        type="text"
                        value={answers[index]}
                        onChange={(e) => handleAnswerChange(index, e.target.value)}
                        className="w-full border border-gray-300 rounded-xl px-4 py-2 outline-none"
                        placeholder="답변을 입력하세요"
                    />
                </div>
            ))}

            {/* 저장 버튼 */}
            <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 w-full max-w-[500px] px-4 pb-4 flex justify-center">
                <button onClick={handleSave} className="w-full py-3 bg-black text-white font-bold rounded-xl">
                    저장하기
                </button>
            </div>

            {/* 모달 */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-xl max-w-xs w-full p-6 space-y-4 text-center">
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
