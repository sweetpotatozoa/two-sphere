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
    init.headers['Authorization'] = `Bearer ${token}`;
    try {
        const res = await fetch(resource, init); // 상대 경로를 사용
        if (responseType === 'blob') {
            return await res.blob();
        }
        const data = await res.json();
        return data;
    } catch (err) {
        console.error('API 요청 실패:', err);
        return null;
    }
};

export default fetcher;
