'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import eyeClosedIcon from '/public/eye-closed-icon.svg';
import eyeOpenIcon from '/public/eye-open-icon.svg';
import arrowLeftIcon from '/public/arrow-left-icon.svg';

const SignUpPage = () => {
    const router = useRouter();

    // 입력 필드 상태 관리
    const [name, setName] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [sex, setSex] = useState('');
    const [jobStatus, setJobStatus] = useState('');
    const [userName, setUserName] = useState(''); // username 상태 추가
    const [password, setPassword] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [isUsernameAvailable, setIsUsernameAvailable] = useState(null);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    // 아이디 중복 확인
    const checkUsername = async () => {
        setError('');
        setIsUsernameAvailable(null);

        try {
            const response = await fetch('/api/signup/check-username', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userName }), // username 전달
            });

            const data = await response.json();
            if (response.status === 200) {
                setIsUsernameAvailable(true); // 사용 가능
            } else if (response.status === 409) {
                setIsUsernameAvailable(false); // 중복
            } else {
                setError(data.message || 'Username check failed.');
            }
        } catch (err) {
            console.error('Username check error:', err);
            setError('Error checking username.');
        }
    };

    // 회원가입 처리
    const handleSignUp = async () => {
        setError('');

        // 필수 입력 필드 확인
        if (!name || !birthDate || !sex || !jobStatus || !userName || !password || !phoneNumber) {
            setError('모든 필드를 입력해주세요.');
            return;
        }

        try {
            const response = await fetch('/api/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    birthDate,
                    sex,
                    jobStatus,
                    userName, // username 전달
                    password,
                    phoneNumber,
                }),
            });

            const data = await response.json();
            if (response.status === 201) {
                alert('회원가입 성공!');
                router.push('/signin'); // 회원가입 성공 후 로그인 페이지로 이동
            } else {
                setError(data.message || '회원가입에 실패했습니다.');
            }
        } catch (err) {
            console.error('Signup error:', err);
            setError('회원가입 요청 중 오류가 발생했습니다.');
        }
    };

    return (
        <div className="max-w-[500px] mx-auto px-4 pt-28 space-y-4">
            {/* 뒤로가기 버튼 */}
            <button onClick={() => router.back()}>
                <Image src={arrowLeftIcon} alt="Go Back" width={20} height={20} />
            </button>

            {/* 이름 */}
            <div>
                <label className="block text-lg font-bold mb-2">이름</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="이름을 입력해주세요"
                    className="w-full border border-gray-300 rounded-xl px-4 py-2 outline-none"
                />
            </div>

            {/* 생년월일 */}
            <div>
                <label className="block text-lg font-bold mb-2">생년월일</label>
                <input
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    placeholder="생년월일을 선택해주세요"
                    className="w-full border border-gray-300 rounded-xl px-4 py-2 outline-none"
                />
            </div>

            {/* 성별 */}
            <div>
                <label className="block text-lg font-bold mb-2">성별</label>
                <select
                    value={sex}
                    onChange={(e) => setSex(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-4 py-2 outline-none"
                >
                    <option value="">성별을 선택해주세요</option>
                    <option value="남성">남성</option>
                    <option value="여성">여성</option>
                </select>
            </div>

            {/* 아이디 */}
            <div>
                <label className="block text-lg font-bold mb-2">아이디</label>
                <div className="flex items-center">
                    <input
                        type="text"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        placeholder="아이디를 입력해주세요"
                        className="w-full border border-gray-300 rounded-xl px-4 py-2 outline-none"
                    />
                    <button onClick={checkUsername} className="ml-2 px-4 py-2 bg-black text-white font-bold rounded-xl">
                        중복 확인
                    </button>
                </div>
                {isUsernameAvailable === true && <p className="text-green-500">사용 가능한 아이디입니다.</p>}
                {isUsernameAvailable === false && <p className="text-red-500">이미 사용 중인 아이디입니다.</p>}
            </div>

            {/* 비밀번호 */}
            <div>
                <label className="block text-lg font-bold mb-2">비밀번호</label>
                <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="비밀번호를 입력해주세요"
                    className="w-full border border-gray-300 rounded-xl px-4 py-2 outline-none"
                />
                <button onClick={() => setShowPassword((prev) => !prev)}>비밀번호 보기</button>
            </div>

            {/* 전화번호 */}
            <div>
                <label className="block text-lg font-bold mb-2">전화번호</label>
                <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="전화번호를 입력해주세요"
                    className="w-full border border-gray-300 rounded-xl px-4 py-2 outline-none"
                />
            </div>

            {/* 직업 */}
            <div>
                <label className="block text-lg font-bold mb-2">직업</label>
                <select
                    value={jobStatus}
                    onChange={(e) => setJobStatus(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-4 py-2 outline-none"
                >
                    <option value="">직업을 선택해주세요</option>
                    <option value="학생">학생</option>
                    <option value="직장인">직장인</option>
                    <option value="자영업">자영업</option>
                    <option value="기타">기타</option>
                </select>
            </div>

            {/* 회원가입 버튼 */}
            <button onClick={handleSignUp} className="w-full py-3 bg-black text-white font-bold rounded-xl">
                회원가입
            </button>

            {/* 에러 메시지 */}
            {error && <p className="text-red-500 text-center">{error}</p>}
        </div>
    );
};

export default SignUpPage;
