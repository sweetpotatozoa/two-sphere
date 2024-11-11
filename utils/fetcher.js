const fetcher = async (url, token, method, params = {}, responseType = 'json') => {
    const resource = method === 'GET' ? `${url}?${new URLSearchParams(params)}` : url;
    const init = ['POST', 'PUT', 'DELETE'].includes(method)
        ? {
              body: JSON.stringify(params),
              headers: {},
          }
        : { headers: {} };
    init.method = method;
    init.headers['Content-Type'] = 'application/json';
    if (token) {
        init.headers['Authorization'] = `Bearer ${token}`;
    }
    try {
        const res = await fetch(resource, init); // 상대 경로를 사용
        if (responseType === 'blob') {
            return await res.blob();
        }
        const data = await res.json();
        if (!res.ok) {
            throw new Error(data.message || 'API 요청 실패');
        }
        return data;
    } catch (err) {
        console.error('API 요청 실패:', err);
        throw err; // 호출한 함수로 에러를 전달
    }
};

// 로그인 API 함수
export const signIn = async (username, password) => {
    return await fetcher('/api/auth/signin', null, 'POST', { username, password });
};

// 회원가입 API 함수
export const signUp = async (userData) => {
    return await fetcher('/api/auth/signup', null, 'POST', userData);
};

export default fetcher;
