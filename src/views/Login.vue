<script setup>
import { ref } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import axios from 'axios'
import NavigationBar from '@/components/NavigationBar.vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

const router = useRouter()

const loginForm = ref({
  id: '',
  password: ''
})

async function login() {
  const res = await axios.post('/api/users/login', {
    id: loginForm.value.id,
    password: loginForm.value.password,
  })

  if (res.status === 200) {
    // 로그인 성공 시 Pinia 상태 즉시 갱신
    userStore.user = res.data.user
    console.log("userStore : ", userStore.user)
    await router.push('/diseases')
  } else {
    alert('아이디 또는 비밀번호가 맞지 않습니다.')
  }
}
</script>

<template>
  <div id="login-page">
    <NavigationBar />

    <section class="page-section" id="login">
      <div class="container px-lg-5">
        <div class="row gx-4 gx-lg-5 justify-content-center">
          <div class="col-lg-8 col-xl-6 text-center">
            <h2 class="mt-0">로그인</h2>
            <hr class="divider" />
          </div>

          <div class="row gx-4 gx-lg-5 justify-content-center mb-5">
            <div class="col-lg-6">
              <form @submit.prevent="login">
                <div class="form-floating mb-3">
                  <input
                      v-model="loginForm.id"
                      class="form-control"
                      type="text"
                      placeholder="아이디를 입력해주세요"
                      required
                  />
                  <label>아이디</label>
                </div>

                <div class="form-floating mb-3">
                  <input
                      v-model="loginForm.password"
                      class="form-control"
                      type="password"
                      placeholder="비밀번호를 입력해주세요"
                      required
                  />
                  <label>비밀번호</label>
                </div>

                <div class="d-grid">
                  <button class="btn btn-primary btn-xl" type="submit">
                    로그인
                  </button>
                </div>

                <p v-if="errorMsg" class="text-danger mt-3">{{ errorMsg }}</p>

                <div class="mt-3 text-center">
                  <RouterLink to="/users/signup" class="link-secondary">
                    회원가입 하기
                  </RouterLink>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
#login-page {
  margin-top: 6rem;
}

.text-danger {
  color: red;
}
</style>
