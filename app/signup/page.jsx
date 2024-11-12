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
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [isUsernameAvailable, setIsUsernameAvailable] = useState(null);
    const [isPasswordMatching, setIsPasswordMatching] = useState(null); // 비밀번호 일치 여부 상태 추가
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
                body: JSON.stringify({ userName }),
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

    // 비밀번호 일치 여부 확인
    useEffect(() => {
        if (confirmPassword) {
            setIsPasswordMatching(password === confirmPassword);
        } else {
            setIsPasswordMatching(null);
        }
    }, [password, confirmPassword]);

    // 회원가입 처리
    const handleSignUp = async () => {
        setError('');

        // 필수 입력 필드 확인
        if (!name || !birthDate || !sex || !jobStatus || !userName || !password || !phoneNumber) {
            setError('모든 필드를 입력해주세요.');
            return;
        }

        // 비밀번호 일치 확인
        if (password !== confirmPassword) {
            setError('비밀번호가 일치하지 않습니다.');
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
                    userName,
                    password,
                    phoneNumber,
                }),
            });

            const data = await response.json();
            if (response.status === 201) {
                alert('회원가입 성공!');
                router.push('/signin');
            } else {
                setError(data.message || '회원가입에 실패했습니다.');
            }
        } catch (err) {
            console.error('Signup error:', err);
            setError('회원가입 요청 중 오류가 발생했습니다.');
        }
    };

    return (
        <div className="max-w-[500px] mx-auto px-4 pt-6 space-y-4">
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
                <div className="flex items-center justify-between relative">
                    <input
                        type="text"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        placeholder="아이디를 입력해주세요"
                        className="w-full border border-gray-300 rounded-xl px-4 py-2 outline-none"
                    />
                    <button
                        onClick={checkUsername}
                        className="absolute right-0 text-md px-4 py-2 bg-black text-white font-bold rounded-xl mr-2"
                    >
                        중복 확인
                    </button>
                </div>
                {isUsernameAvailable === true && (
                    <p className="text-green-500 text-sm mt-1">사용 가능한 아이디입니다.</p>
                )}
                {isUsernameAvailable === false && (
                    <p className="text-red-500 text-sm mt-1">이미 사용 중인 아이디입니다.</p>
                )}
            </div>

            {/* 비밀번호 */}
            <div>
                <label className="block text-lg font-bold mb-2">비밀번호</label>
                <div className="flex items-center border border-gray-300 rounded-xl px-4 py-2">
                    <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="비밀번호를 입력해주세요"
                        className="w-full outline-none text-gray-600"
                    />
                    <button
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="flex items-center justify-center ml-2"
                    >
                        <Image
                            src={showPassword ? eyeOpenIcon : eyeClosedIcon}
                            alt="Toggle Password Visibility"
                            width={20}
                            height={20}
                        />
                    </button>
                </div>
            </div>

            {/* 비밀번호 확인 */}
            <div>
                <label className="block text-lg font-bold mb-2">비밀번호 확인</label>
                <div className="flex items-center border border-gray-300 rounded-xl px-4 py-2 relative">
                    <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="비밀번호를 다시 입력해주세요"
                        className="w-full outline-none text-gray-600"
                    />
                    <button
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                        className="flex items-center justify-center ml-2"
                    >
                        <Image
                            src={showConfirmPassword ? eyeOpenIcon : eyeClosedIcon}
                            alt="Toggle Confirm Password Visibility"
                            width={20}
                            height={20}
                        />
                    </button>
                </div>
                {isPasswordMatching === true && <p className="text-green-500 text-sm mt-1">비밀번호가 일치합니다.</p>}
                {isPasswordMatching === false && (
                    <p className="text-red-500 text-sm mt-1">비밀번호가 일치하지 않습니다.</p>
                )}
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
