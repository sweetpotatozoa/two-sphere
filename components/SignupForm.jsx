import React, { useState } from 'react';
import fetcher from '../utils/fetcher';
import { useRouter } from 'next/router';

function SignupForm() {
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
    const [isUsernameAvailable, setIsUsernameAvailable] = useState(false); // 아이디 중복 확인 상태
    const router = useRouter();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const checkUsername = async () => {
        try {
            const response = await fetcher(
                '/api/signup/check-username', // 아이디 중복 검사 API
                '',
                'POST',
                { userName: formData.userName }
            );

            if (response && response.message === 'Username is available') {
                alert('사용 가능한 아이디입니다.');
                setIsUsernameAvailable(true);
            } else {
                alert('중복된 아이디입니다.');
                setIsUsernameAvailable(false);
            }
        } catch (err) {
            setError('아이디 중복 검사 중 오류가 발생했습니다.');
        }
    };

    const handleSignup = async (e) => {
        e.preventDefault();

        if (!isUsernameAvailable) {
            setError('아이디 중복 검사를 먼저 완료해주세요.');
            return;
        }

        try {
            const response = await fetcher(
                '/api/signup', // 회원가입 API
                '',
                'POST',
                formData
            );

            if (response) {
                alert('회원가입 성공! 환영 페이지로 이동합니다.');
                router.push('/welcome'); // 환영 페이지로 이동
            } else {
                setError('회원가입에 실패했습니다.');
            }
        } catch (err) {
            setError('네트워크 오류가 발생했습니다.');
        }
    };

    return (
        <form onSubmit={handleSignup}>
            <input name="name" placeholder="Name" onChange={handleChange} required />
            <input name="birthDate" placeholder="Birth Date" type="date" onChange={handleChange} required />
            <input name="sex" placeholder="Sex" onChange={handleChange} required />
            <input name="jobStatus" placeholder="Job Status" onChange={handleChange} required />
            <input name="userName" placeholder="Username" onChange={handleChange} required />
            <button type="button" onClick={checkUsername}>
                아이디 중복 검사
            </button>
            <input name="password" placeholder="Password" type="password" onChange={handleChange} required />
            <input name="phoneNumber" placeholder="Phone Number" onChange={handleChange} required />
            <button type="submit">회원가입</button>
            {success && <p style={{ color: 'green' }}>{success}</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </form>
    );
}

export default SignupForm;
