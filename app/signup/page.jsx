'use client';

import React, { useState } from 'react';
import fetcher from '../../utils/fetcher';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
    const [formData, setFormData] = useState({
        name: '',
        birthDate: '',
        sex: '',
        jobStatus: '',
        userName: '',
        password: '',
        phoneNumber: '',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const router = useRouter();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSignup = async (e) => {
        e.preventDefault(); // 기본 폼 제출 동작 방지

        try {
            const response = await fetcher(
                '/api/signup', // 회원가입 API 경로
                '',
                'POST',
                formData // 요청 데이터
            );

            if (response && response.message === 'User registered successfully') {
                setSuccess('회원가입이 완료되었습니다! 환영합니다!');
                // 회원가입 성공 후 프로필 페이지로 이동 <- 프론트에서 수정 필요
                router.push('/my-profile');
            } else {
                setError(response?.message || '회원가입에 실패했습니다.');
            }
        } catch (err) {
            setError('네트워크 오류가 발생했습니다.');
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center">
            <h1 className="text-2xl font-bold mb-4">회원가입</h1>
            <form onSubmit={handleSignup} className="flex flex-col space-y-4 w-full max-w-md">
                <input name="name" placeholder="이름" onChange={handleChange} required className="border rounded p-2" />
                <input
                    name="birthDate"
                    type="date"
                    placeholder="생년월일"
                    onChange={handleChange}
                    required
                    className="border rounded p-2"
                />
                <input name="sex" placeholder="성별" onChange={handleChange} required className="border rounded p-2" />
                <input
                    name="jobStatus"
                    placeholder="직업 상태"
                    onChange={handleChange}
                    required
                    className="border rounded p-2"
                />
                <input
                    name="userName"
                    placeholder="아이디"
                    onChange={handleChange}
                    required
                    className="border rounded p-2"
                />
                <input
                    name="password"
                    type="password"
                    placeholder="비밀번호"
                    onChange={handleChange}
                    required
                    className="border rounded p-2"
                />
                <input
                    name="phoneNumber"
                    placeholder="전화번호"
                    onChange={handleChange}
                    required
                    className="border rounded p-2"
                />
                <button type="submit" className="bg-blue-500 text-white rounded p-2">
                    회원가입
                </button>
            </form>
            {success && <p className="text-green-500 mt-4">{success}</p>}
            {error && <p className="text-red-500 mt-4">{error}</p>}
        </div>
    );
}
