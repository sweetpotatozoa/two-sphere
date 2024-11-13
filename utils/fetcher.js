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

// 사용자의 sphere 정보 조회 함수
export const getUserSpheres = async (token) => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL; // API 베이스 URL
    const endpoint = `${apiBaseUrl}/api/my-spheres`; // 사용자 스피어 조회 엔드포인트
    return await fetcher(endpoint, token, 'GET'); // GET 요청
};

// 취소 sphere 상태 조회 함수
export const getSphereStatus = async (sphereId, token) => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL; // API 베이스 URL 가져오기
    const endpoint = `${apiBaseUrl}/api/sphere/${sphereId}/cancel`; // 스피어 상태 조회 엔드포인트
    return await fetcher(endpoint, token, 'GET'); // GET 요청
};

// 스피어 상세 정보 조회 함수
export const getSphereDetails = async (sphereId, token) => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const endpoint = `${apiBaseUrl}/api/sphere/${sphereId}`;
    return await fetcher(endpoint, token, 'GET'); // GET 요청
};

//sphere/[id] 더미데이터 테스트용
// export const getSphereDetails = async (sphereId, token) => {
//     // 더미 데이터
//     const dummySphere = {
//         _id: '6730ad4f34bf9db597c12094',
//         title: '식당3',
//         subTitle: '개성 있는 스타트업 대표들의 모임',
//         content: '좋은 분위기에서 맛있는 음식을 먹으며 대화를 나누는 시간을 가질 예정입니다.',
//         status: 'open',
//         createdAt: '2024-11-10T12:55:42.997+00:00',
//         location: {
//             address: '서울 강남구',
//             city: 'Seoul',
//         },
//         firstDate: '2024-11-13T10:30:00+00:00',
//         secondDate: '2024-11-20T10:30:00+00:00',
//         subjects: ['음식', '스타트업', '네트워킹'],
//         thumbnail: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/17/3b/51/14/2024.jpg',
//         subImage1: 'https://www.palnews.co.kr/news/photo/201801/92969_25283_5321.jpg',
//         subImage2: 'https://flexible.img.hani.co.kr/flexible/970/582/imgdb/child/2024.jpg',
//         participants: [
//             {
//                 userId: '648a96f33fa7a1b19c2f4f89',
//                 payment: 'paid',
//                 isHost: true,
//                 cancelInfo: {
//                     isCancel: false,
//                     reason: '',
//                     createdAt: null,
//                 },
//                 attendCount: 1,
//             },
//         ],
//     };

//     console.log('Returning dummy sphere data...');
//     return dummySphere; // 실제 API 호출 대신 더미 데이터 반환
// };

// 스피어 참여 요청 함수
export const joinSphere = async (sphereId, isHost, token) => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const endpoint = `${apiBaseUrl}/api/sphere/${sphereId}`;
    const body = { isHost };
    return await fetcher(endpoint, token, 'POST', body); // POST 요청
};

export default fetcher;
