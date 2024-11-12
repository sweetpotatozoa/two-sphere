const fetcher = async (url, token, method, params = {}, responseType = 'json') => {
    const headers = { 'Content-Type': 'application/json' };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    const init = {
        method,
        headers,
        ...(method !== 'GET' && { body: JSON.stringify(params) }), // GET 외 요청은 body 포함
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
    return await fetcher('/api/auth/signin', null, 'POST', { userName, password });
};

// 회원가입 API 함수
export const signUp = async (userData) => {
    return await fetcher('/api/auth/signup', null, 'POST', userData);
};
// 예약 취소용 fetcher
export const cancelReservation = async (reservationId, cancelData) => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL; // 환경 변수에서 API URL 가져옴
    const endpoint = `${apiBaseUrl}/api/sphere/${reservationId}/cancel`; // 취소 API 엔드포인트 설정

    return await fetcher(endpoint, null, 'POST', cancelData);
};
// 닫힌 스피어용 fetcher
export const getClosedSpheres = async () => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL; // API 기본 URL 가져오기
    const endpoint = `${apiBaseUrl}/api/spheres/closed`; // 'closed' 상태 스피어 조회 엔드포인트
    return await fetcher(endpoint, null, 'GET'); // GET 요청
};
// 열린 스피어용 fetcher
export const getOpenSpheres = async () => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL; // API 기본 URL 가져오기
    const endpoint = `${apiBaseUrl}/api/spheres/open`; // 'open' 상태 스피어 조회 엔드포인트
    return await fetcher(endpoint, null, 'GET'); // GET 요청
};

export default fetcher;
