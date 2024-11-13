// utils/fetcher.js

const fetcher = async (url, token = null, method = 'GET', params = {}, responseType = 'json', headers = {}) => {
    // 기본 헤더 설정
    headers['Content-Type'] = 'application/json';
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const init = {
        method,
        headers,
        ...(method !== 'GET' && { body: JSON.stringify(params) }), // GET 요청 외 body 추가
    };

    try {
        const res = await fetch(url, init);

        if (!res.ok) {
            const error = await res.json();
            console.error(`Error in fetcher: ${res.status} ${res.statusText}`, error);
            throw new Error(error.message || 'API 요청 실패');
        }

        return responseType === 'blob' ? await res.blob() : await res.json();
    } catch (error) {
        console.error('Fetch error:', error.message);
        throw error;
    }
};

// 로그인 API 함수
export const signIn = async (userName, password) => {
    return await fetcher('/api/signin', null, 'POST', { userName, password });
};

// 회원가입 API 함수
export const signUp = async (userData) => {
    const response = await fetch('/api/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    });

    return {
        status: response.status,
        json: await response.json(),
    };
};

// 예약 취소용 fetcher 함수
export const cancelReservation = async (reservationId, cancelData) => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const endpoint = `${apiBaseUrl}/api/sphere/${reservationId}/cancel`;

    const token = localStorage.getItem('token'); // 토큰 가져오기
    if (!token) {
        throw new Error('Access token is missing. Please log in again.');
    }

    return await fetcher(endpoint, token, 'POST', cancelData);
};

// 닫힌 스피어용 fetcher 함수
export const getClosedSpheres = async () => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const endpoint = `${apiBaseUrl}/api/spheres/closed`;

    return await fetcher(endpoint);
};

// 열린 스피어용 fetcher 함수 - 로그인 없이 사용 가능
export const getOpenSpheres = async () => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const endpoint = `${apiBaseUrl}/api/spheres/open`;

    return await fetcher(endpoint); // 인증 없이 호출
};

// 사용자의 sphere 정보 조회 함수
export const getUserSpheres = async (token) => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const endpoint = `${apiBaseUrl}/api/my-spheres`;

    if (!token) {
        throw new Error('Access token is missing. Please log in again.');
    }

    console.log('getUserSpheres - Token:', token); // 토큰 확인 로그

    // token을 사용하여 헤더 설정
    return await fetcher(endpoint, token, 'GET');
};

// 취소 sphere 상태 조회 함수
export const getSphereStatus = async (sphereId) => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const endpoint = `${apiBaseUrl}/api/sphere/${sphereId}/cancel`;

    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('Access token is missing. Please log in again.');
    }

    return await fetcher(endpoint, token, 'GET');
};

// 스피어 상세 정보 조회 함수
export const getSphereDetails = async (sphereId) => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const endpoint = `${apiBaseUrl}/api/sphere/${sphereId}`;

    return await fetcher(endpoint);
};

// 스피어 참여 요청 함수
export const joinSphere = async (sphereId, isLeader, userId, token) => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const endpoint = `${apiBaseUrl}/api/sphere/${sphereId}`;

    if (!token) {
        throw new Error('Access token is missing. Please log in again.');
    }

    // userId를 'x-user-id' 헤더에 포함
    const headers = {
        Authorization: `Bearer ${token}`,
        'x-user-id': userId, // userId를 x-user-id로 설정
    };

    // isLeader 정보를 포함한 요청 본문
    const body = { isLeader };
    return await fetcher(endpoint, null, 'POST', body, 'json', headers); // 헤더를 fetcher로 전달
};

export default fetcher;
