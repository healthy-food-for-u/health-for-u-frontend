import { defineStore } from 'pinia'
import axios from 'axios'
import {useRouter} from "vue-router";

export const useUserStore = defineStore('user', {
    state: () => ({
        user: null,
    }),
    actions: {
        async fetchUser() {
            try {
                const res = await axios.get('/api/users/user', {
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
                await axios.post('/api/users/logout')
                this.user = null
                const router = useRouter()
                await router.push('/')
            } catch (err) {
                console.error('로그아웃 오류:', err)
            }
        }
    }
})
