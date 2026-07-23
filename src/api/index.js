import axios from 'axios';
import router from "@/router/index.js";
import {useUserStore} from "@/stores/user.js";

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
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.log("에러 반환 : ", error.response);

        if (error.response) {
            const status = error.response.status;
            const data = error.response.data;
            const code = data?.code;
            const message = data?.message;

            if (
                status === 401 ||
                code === 'EXPIRED_REFRESH_TOKEN' ||
                code === 'INVALID_TOKEN' ||
                code === 'REFRESH_TOKEN_MISMATCH'
            ) {
                const userStore = useUserStore();

                // API 호출 없이 즉시 상태와 스토리지를 비움 (Promise 반환 없음)
                userStore.clearAuth();

                alert(message || '인증이 만료되었습니다. 다시 로그인해 주세요.');
                router.push('/auth/login');
            }
        }
        return Promise.reject(error);
    }
);

export default api;