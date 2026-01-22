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
                const res = await axios.get('/api/users/user')
                this.user = res.data.user
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
