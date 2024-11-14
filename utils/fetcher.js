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
    return await fetcher('/api/spheres/closed', null, 'GET');
};

// 열린 스피어용 fetcher 함수 - 로그인 없이 사용 가능
export const getOpenSpheres = async () => {
    return await fetcher('/api/spheres/open', null, 'GET');
};

// 사용자의 sphere 정보 조회 함수
export const getUserSpheres = async (token) => {
    if (!token) {
        throw new Error('Access token is missing. Please log in again.');
    }

    // token을 사용하여 헤더 설정
    return await fetcher('/api/my-spheres', token, 'GET');
};

// 취소 sphere 상태 조회 함수
export const getSphereStatus = async (sphereId) => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('Access token is missing. Please log in again.');
    }

    return await fetcher(endpoint, token, 'GET');
};

// 스피어 상세 정보 조회 함수
export const getSphereDetails = async (sphereId) => {
    const token = localStorage.getItem('token'); // 토큰 가져오기
    return await fetcher(`/api/sphere/${sphereId}`, token, 'GET'); // 템플릿 리터럴로 sphereId 삽입
};

// 스피어 참여 요청 함수
export const joinSphere = async (sphereId, requestLeader) => {
    const token = localStorage.getItem('token'); // 토큰 가져오기
    if (!token) {
        throw new Error('Access token is missing. Please log in again.');
    }
    return await fetcher(`/api/sphere/${sphereId}`, token, 'POST', requestLeader);
};

export default fetcher;
