// app/signup/page.jsx
'use client';

import React, { useState, useEffect, useContext } from 'react';
import DatePickerModal from '../../components/DatePickerModal';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import eyeIcon from '/public/eye-icon.svg';
import arrowDownIcon from '/public/arrow-down-icon.svg';
import arrowLeftIcon from '/public/arrow-left-icon.svg';
import { useAuth } from '../../context/AuthContext';

const SignUpPage = () => {
    const router = useRouter();
    const { isAuthenticated, login } = useAuth(); // AuthContext에서 값을 가져옴
    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
    const [birthDate, setBirthDate] = useState('생년월일을 선택해주세요');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    useEffect(() => {
        // 이미 로그인된 경우 리디렉션
        if (isAuthenticated) {
            router.push('/');
        }
    }, [isAuthenticated, router]);

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword((prev) => !prev);
    };

    return (
        <div className="max-w-[500px] mx-auto px-4 pt-28 space-y-4">
            {/* 뒤로가기 버튼 */}
            <button onClick={() => router.back()}>
                <Image src={arrowLeftIcon} alt="Go Back" width={20} height={20} />
            </button>

            {/* 아이디 */}
            <div>
                <label className="block text-lg font-bold mb-2">아이디</label>
                <input
                    type="text"
                    placeholder="아이디를 입력해주세요"
                    className="w-full border border-gray-300 rounded-full px-4 py-2 outline-none"
                />
            </div>

            {/* 비밀번호 */}
            <div>
                <label className="block text-lg font-bold mb-2">비밀번호</label>
                <div className="flex items-center border border-gray-300 rounded-full px-4 py-2">
                    <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="비밀번호를 입력해주세요"
                        className="w-full outline-none text-gray-600"
                    />
                    <button onClick={togglePasswordVisibility} className="flex items-center justify-center ml-2">
                        <Image src={eyeIcon} alt="Toggle Password Visibility" width={20} height={20} />
                    </button>
                </div>
            </div>

            {/* 비밀번호 확인 */}
            <div className="mt-4">
                <label className="block text-lg font-bold mb-2">비밀번호 확인</label>
                <div className="flex items-center border border-gray-300 rounded-full px-4 py-2">
                    <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="비밀번호를 다시 입력해주세요"
                        className="w-full outline-none text-gray-600"
                    />
                    <button onClick={toggleConfirmPasswordVisibility} className="flex items-center justify-center ml-2">
                        <Image src={eyeIcon} alt="Toggle Confirm Password Visibility" width={20} height={20} />
                    </button>
                </div>
            </div>

            {/* 이름 */}
            <div>
                <label className="block text-lg font-bold mb-2">이름</label>
                <input
                    type="text"
                    placeholder="이름을 입력해주세요"
                    className="w-full border border-gray-300 rounded-full px-4 py-2 outline-none"
                />
            </div>

            {/* 생년월일 */}
            <div>
                <label className="block text-lg font-bold mb-2">생년월일</label>
                <input
                    type="date"
                    placeholder="생년월일을 선택해주세요"
                    className="w-full border border-gray-300 rounded-full px-4 py-2 outline-none"
                />
            </div>

            {/* 성별 */}
            <div>
                <label className="block text-lg font-bold mb-2">성별</label>
                <select
                    className="w-full border border-gray-300 rounded-full px-4 py-2 outline-none appearance-none pr-10"
                    style={{
                        background: `url(${arrowDownIcon}) no-repeat right 1rem center`,
                        backgroundSize: '1rem',
                    }}
                >
                    <option>남성</option>
                    <option>여성</option>
                    <option>선택하지 않음</option>
                </select>
            </div>

            {/* 신분 */}
            <div>
                <label className="block text-lg font-bold mb-2">신분</label>
                <select
                    className="w-full border border-gray-300 rounded-full px-4 py-2 outline-none appearance-none pr-10"
                    style={{
                        background: `url(${arrowDownIcon}) no-repeat right 1rem center`,
                        backgroundSize: '1rem',
                    }}
                >
                    <option>본인의 현재 신분을 선택해주세요</option>
                    <option>학생</option>
                    <option>직장인</option>
                    <option>자영업</option>
                    <option>기타</option>
                </select>
            </div>

            {/* 통신사 */}
            <div>
                <label className="block text-lg font-bold mb-2">통신사</label>
                <select
                    className="w-full border border-gray-300 rounded-full px-4 py-2 outline-none appearance-none pr-10"
                    style={{
                        background: `url(${arrowDownIcon}) no-repeat right 1rem center`,
                        backgroundSize: '1rem',
                    }}
                >
                    <option>통신사를 선택해주세요</option>
                    <option>SKT</option>
                    <option>KT</option>
                    <option>LG U+</option>
                    <option>SKT 알뜰폰</option>
                    <option>KT 알뜰폰</option>
                    <option>LG U+ 알뜰폰</option>
                </select>
            </div>

            {/* 전화번호 */}
            <div>
                <label className="block text-lg font-bold mb-2">전화번호</label>
                <input
                    type="tel"
                    placeholder="전화번호를 입력해주세요"
                    className="w-full border border-gray-300 rounded-full px-4 py-2 outline-none"
                />
            </div>

            {/* 인증번호 */}
            <div>
                <label className="block text-lg font-bold mb-2">인증번호</label>
                <div className="flex items-center border border-gray-300 rounded-full px-4 py-2">
                    <input
                        type="text"
                        placeholder="인증번호를 입력해주세요"
                        className="flex-grow outline-none text-gray-600 px-2"
                    />
                    <button className="bg-black text-white px-4 py-2 rounded-full ml-2 font-semibold">인증하기</button>
                </div>
            </div>

            {/* 회원가입 버튼 */}
            <button className="w-full py-3 bg-black text-white font-bold rounded-full">회원가입</button>
        </div>
    );
};

export default SignUpPage;
