// utils/fetcher.js

const fetcher = async (url, token = null, method = 'GET', params = {}, responseType = 'json') => {
    const headers = { 'Content-Type': 'application/json' };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const init = {
        method,
        headers,
        ...(method !== 'GET' && { body: JSON.stringify(params) }), // GET 요청 외 body 추가
    };

    const res = await fetch(url, init);

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'API 요청 실패');
    }

    return responseType === 'blob' ? await res.blob() : await res.json();
};

// 로그인 API 함수
export const signIn = async (userName, password) => {
    return await fetcher('/api/signin', null, 'POST', { userName, password });
};

// 회원가입 API 함수 (fetcher를 사용하지 않는 방식)
export const signUp = async (userData) => {
    const response = await fetch('/api/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    });

    // 상태 코드와 JSON 응답을 함께 반환하여 상태 코드에 따라 처리 가능하도록 설정
    return {
        status: response.status,
        json: await response.json(),
    };
};

// 예약 취소용 fetcher 함수
export const cancelReservation = async (reservationId, cancelData, token) => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const endpoint = `${apiBaseUrl}/api/sphere/${reservationId}/cancel`;

    return await fetcher(endpoint, token, 'POST', cancelData);
};

// 닫힌 스피어용 fetcher 함수
export const getClosedSpheres = async (token) => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const endpoint = `${apiBaseUrl}/api/spheres/closed`;
    return await fetcher(endpoint, token, 'GET');
};

// 열린 스피어용 fetcher 함수
export const getOpenSpheres = async (token) => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const endpoint = `${apiBaseUrl}/api/spheres/open`;
    return await fetcher(endpoint, token, 'GET');
};

export default fetcher;
