// app/my-profile/page.jsx
'use client';

import React from 'react';
import Image from 'next/image';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';

export default function MyProfilePage() {
    const router = useRouter();
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout(); // 로그아웃 함수 호출
        router.push('/'); // 홈 페이지로 리디렉션
    };

    return (
        <div className="max-w-[500px] mx-auto px-4 py-8 text-center ">
            {/* 프로필 이미지 */}
            <div className="flex justify-center mb-4">
                <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center">
                    <Image src="/profile-icon-black.svg" alt="User Icon" width={48} height={48} />
                </div>
            </div>

            {/* 기본 정보 */}
            <div className="flex justify-center items-center">
                <h1 className="text-2xl font-bold">{user?.name || '로그인 안 됨!'}</h1>
                {/* 로그아웃 버튼 */}
                <button onClick={handleLogout} className="flex items-center justify-center py-1.5 px-4">
                    <Image src="/logout-icon.svg" alt="Logout" width={20} height={20} />
                </button>
            </div>
            <p className="text-gray-600 mt-2">{user?.career || '한 줄 커리어'}</p>

            {/* 질문 목록 */}
            <div className="border-t border-gray-300 my-4"></div>

            {/* 개별 질문 섹션 */}
            <div className="text-left mb-6">
                <h2 className="ml-4 text-md font-bold">
                    Q1. 현재 어떤 일을 하고 있는지, 어떤 일상을 보내고 있는지 알려주세요.
                </h2>
                <p className="text-gray-600 mt-2">{user?.answers[0]}</p>
                <div className="border-b border-gray-300 mt-4"></div>
            </div>

            <div className="text-left mb-6">
                <h2 className="ml-4 text-md font-bold">Q2. 나를 가장 잘 표현하는 세 가지 단어는 무엇인가요?</h2>
                <p className="text-gray-600 mt-2">{user?.answers[1]}</p>
                <div className="border-b border-gray-300 mt-4"></div>
            </div>

            <div className="text-left mb-6">
                <h2 className="ml-4 text-md font-bold">Q3. 가장 몰입하는 순간은 언제인가요?</h2>
                <p className="text-gray-600 mt-2">{user?.answers[2]}</p>
                <div className="border-b border-gray-300 mt-4"></div>
            </div>

            <div className="text-left mb-6">
                <h2 className="ml-4 text-md font-bold">Q4. 인생에서 꼭 이루고 싶은 목표가 있다면 무엇인가요?</h2>
                <p className="text-gray-600 mt-2">{user?.answers[3]}</p>
                <div className="border-b border-gray-300 mt-4"></div>
            </div>

            <div className="text-left mb-6">
                <h2 className="ml-4 text-md font-bold">Q5. 다른 사람들에게 어떻게 기억되고 싶나요?</h2>
                <p className="text-gray-600 mt-2">{user?.answers[4]}</p>
                <div className="border-b border-gray-300 mt-4"></div>
            </div>

            {/* 프로필 수정하기 버튼 */}
            <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 w-full max-w-[500px] px-4 pb-4 flex justify-center">
                <button
                    onClick={() => router.push('/my-profile/edit')} // 수정 페이지로 이동
                    className="w-full py-3 bg-black text-white font-bold rounded-xl "
                >
                    프로필 수정하기
                </button>
            </div>
        </div>
    );
}
