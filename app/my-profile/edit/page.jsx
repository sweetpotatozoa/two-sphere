// app/my-profile/edit/page.jsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';

export default function EditProfilePage() {
    const router = useRouter();
    const { user } = useAuth();

    // 현재 커리어 및 답변 값으로 초기화
    const [career, setCareer] = useState(user?.career || '');
    const [answers, setAnswers] = useState(user?.answers || Array(5).fill(''));

    // 각 질문의 답변을 업데이트하는 함수
    const handleAnswerChange = (index, value) => {
        const updatedAnswers = [...answers];
        updatedAnswers[index] = value;
        setAnswers(updatedAnswers);
    };

    const handleSave = () => {
        // 수정 데이터 저장 로직 추가 (예: 서버 요청)
        console.log('저장:', { career, answers });
        router.push('/my-profile'); // 저장 후 프로필 페이지로 이동
    };

    return (
        <div className="max-w-[500px] mx-auto px-4 py-16">
            <h1 className="text-2xl font-bold mb-8">프로필 수정</h1>

            {/* 커리어 수정 */}
            <div className="mb-8">
                <label className="block text-lg font-bold mb-2">커리어</label>
                <input
                    type="text"
                    value={career}
                    onChange={(e) => setCareer(e.target.value)}
                    className="w-full border border-gray-300 rounded-full px-4 py-2 outline-none"
                    placeholder="커리어를 입력하세요"
                />
            </div>

            {/* 질문과 답변 수정 */}
            {[
                '현재 어떤 일을 하고 있는지 알려주세요',
                '당신을 가장 잘 표현하는 세 가지 단어는 무엇인가요?',
                '당신이 가장 몰입하는 순간은 언제인가요?',
                '당신의 인생에서 꼭 이루고 싶은 목표가 있다면 무엇인가요?',
                '다른 사람들에게 어떻게 기억되고 싶나요?',
            ].map((question, index) => (
                <div key={index} className="mb-8">
                    <label className="block text-lg font-bold mb-2">{`Q${index + 1}. ${question}`}</label>
                    <input
                        type="text"
                        value={answers[index]}
                        onChange={(e) => handleAnswerChange(index, e.target.value)}
                        className="w-full border border-gray-300 rounded-full px-4 py-2 outline-none"
                        placeholder="답변을 입력하세요"
                    />
                </div>
            ))}

            {/* 저장 버튼 */}
            <button onClick={handleSave} className="w-full py-3 bg-black text-white font-bold rounded-full mt-8">
                저장하기
            </button>
        </div>
    );
}
