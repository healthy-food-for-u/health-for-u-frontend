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
        async logout() {
            try {
                const token = localStorage.getItem('accessToken');

                await api.post('/auth/logout', null, {
                    headers: {
                        // 백엔드가 기대하는 "Bearer " 포맷을 맞춰줍니다.
                        'Authorization': `Bearer ${token}`
                    }
                });

                // 성공 시 상태 초기화
                this.user = null;
                localStorage.removeItem('user');
                localStorage.removeItem('accessToken');

                await router.push('/');
            } catch (err) {
                console.error('로그아웃 오류:', err);
                // 에러가 나도 일단 로컬 데이터는 지우는 게 안전합니다.
                this.user = null;
                localStorage.removeItem('user');
            }
        }
    }

})
