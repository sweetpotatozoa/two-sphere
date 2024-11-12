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

export default fetcher;
