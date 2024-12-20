'use client';
/* eslint-disable react/no-unescaped-entities */

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { questions } from '../page';

export default function EditProfilePage() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [job, setJob] = useState('');
    const [career, setCareer] = useState('');
    const [answers, setAnswers] = useState(Array(5).fill('')); // 기본값으로 빈 배열 설정
    const [isModalOpen, setIsModalOpen] = useState(false);

    // 사용자 데이터를 가져오는 함수
    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem('token'); // 로컬 스토리지에서 토큰 가져오기
            if (!token) {
                router.push('/signin'); // 토큰이 없으면 로그인 페이지로 리디렉션
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
                    setJob(data.user.job || '');
                    setCareer(data.user.career || '');
                    setAnswers(Array.isArray(data.user.answers) ? data.user.answers : Array(5).fill('')); // answers 검증
                } else {
                    console.error('Failed to fetch user data:', response.status);
                }
            } catch (error) {
                console.error('Failed to fetch user data:', error);
            }
        };
        fetchUserData();
    }, [router]);

    // 각 답변 입력값 업데이트
    const handleAnswerChange = (index, value) => {
        const updatedAnswers = [...answers];
        updatedAnswers[index] = value;
        setAnswers(updatedAnswers);
    };

    // 프로필 저장
    const handleSave = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch('/api/my-profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ job, career, answers }),
            });
            if (response.ok) {
                router.push('/my-profile'); // 저장 성공 시 프로필 페이지로 이동
            } else {
                console.error('Failed to save profile data:', response.status);
            }
        } catch (error) {
            console.error('Failed to save profile data:', error);
        }
    };

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    if (!user) return <p className="flex flex-col items-center mt-12">사용자 데이터를 불러오는 중입니다.</p>;

    return (
        <div className="max-w-[500px] mx-auto px-4 py-8">
            {/* 프로필 이미지 */}
            <div className="text-center mb-4">
                <div className="flex justify-center mb-4">
                    <div
                        className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center cursor-pointer"
                        onClick={openModal}
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
                <h1 className="text-2xl font-bold">{user.name || '로그인 안 됨!'}</h1>
            </div>

            {/* 커리어 수정 */}
            <div className="mb-4">
                <label className="ml-3 block text-md font-bold mb-2">한 줄 커리어</label>
                <input
                    type="text"
                    value={career}
                    onChange={(e) => setCareer(e.target.value)}
                    className="w-[calc(100%-16px)] border border-gray-300 rounded-xl mx-2 px-4 py-2 outline-none"
                    placeholder="ex) 유튜브 '조코딩' 대표 / 전) LG CNS 앱 개발자"
                />
            </div>

            {/* 직업 수정 */}
            <div className="mb-4">
                <label className="ml-3 block text-md font-bold mb-2">프로필 미리보기용 간략 커리어</label>
                <input
                    type="text"
                    value={job}
                    onChange={(e) => {
                        const input = e.target.value;

                        // 한글은 2자, 영어와 숫자는 1자로 계산
                        const calculateLength = (str) => {
                            let length = 0;
                            for (let char of str) {
                                // 한글 문자는 정규식으로 체크하여 길이 2로 계산
                                length += /[가-힣]/.test(char) ? 2 : 1;
                            }
                            return length;
                        };

                        // 문자열 길이 계산
                        if (calculateLength(input) <= 25) {
                            setJob(input);
                        }
                    }}
                    className="w-[calc(100%-16px)] border border-gray-300 rounded-xl mx-2 px-4 py-2 outline-none"
                    placeholder="공백 포함 한글 기준 13자, 영어 기준 25자 이내"
                />
            </div>

            {/* 질문과 답변 수정 */}
            {questions.map((question, index) => (
                <div key={index} className="mb-4">
                    <label className="ml-3 block text-md font-bold mb-2">{`Q${index + 1}. ${question}`}</label>
                    <input
                        type="text"
                        value={answers[index] || ''} // 빈 문자열로 기본값 설정
                        onChange={(e) => handleAnswerChange(index, e.target.value)}
                        className="w-[calc(100%-16px)] border border-gray-300 rounded-xl mx-2 px-4 py-2 outline-none"
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
                <div className="fixed top-0 left-1/2 transform -translate-x-1/2 w-full max-w-[500px] h-[calc(100vh-3rem)] z-40 flex">
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-xl max-w-xs w-full space-y-4 text-center">
                            <p>
                                프로필 사진 등록/수정을 원하시는 경우,
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
