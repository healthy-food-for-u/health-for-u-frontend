import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080/api/v1',
    headers: {
        'Content-Type' : 'application/json'
    }
})

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        } else {
            // 토큰이 없으면 혹시 남아있을지 모를 헤더를 제거
            delete config.headers.Authorization;
        }
        return config;
    },
);

export default api;