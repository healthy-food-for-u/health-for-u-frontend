import { defineStore } from 'pinia'
import api from '@/api';
import router from '@/router';

export const useUserStore = defineStore('user', {
    state: () => ({
        user: JSON.parse(localStorage.getItem('user')) || null,
    }),
    actions: {
        async fetchUser() {
            try {
                const res = await api.get('/users/user', {
                    withCredentials: true
                })
                // 백엔드가 반환하는 JSON 구조가 { user: { ... } } 인지, { ... } 자체인지 확인
                this.user = res.data;
            } catch {
                this.user = null
            }
        },
        // 강제 로그아웃/만료 시 API 호출 없이 즉시 정리하는 용도
        clearAuth() {
            this.user = null;
            localStorage.removeItem('user');
            localStorage.removeItem('accessToken');
        },
        async logout() {
            try {
                const token = localStorage.getItem('accessToken');
                await api.post('/auth/logout', null, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
            } catch (err) {
                console.error('로그아웃 오류:', err);
            } finally {
                // 성공하든 실패하든 확실하게 비우기
                this.clearAuth();
                await router.push('/');
            }
        }
    }

})
