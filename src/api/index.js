import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080/api/v1',
    headers: {
        'Content-Type' : 'application/json'
    }
})

api.interceptors.request.use(config => {
    const token = localStorage.getItem('token'); // 로그인이 성공했을 때 저장해둔 토큰
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;