<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import axios from 'axios'
import NavigationBar from "@/components/NavigationBar.vue";
import api from '@/api'


const user = ref(null)

const loginForm = ref({
  loginId: '',
  password: '',
})

async function login() {
  try {
    const res = await api.post('/auth/login', loginForm.value)
    user.value = res.data
  } catch (e) {
    alert('로그인 실패')
  }
}

async function logout() {
  await api.post('/auth/logout')
  user.value = null
}
</script>

<template>
  <div id="page-top">
    <!-- Navigation -->
    <NavigationBar />

    <!-- Masthead -->
    <header class="masthead">
      <div class="container px-lg-5 h-100">
        <div class="row gx-4 gx-lg-5 h-100 align-items-center justify-content-center text-center">
          <div class="col-lg-8 align-self-end">
            <h1 class="text-white font-weight-bold">
              <strong>질환별 식단관리,<br />이제 간단하게 찾아보세요!</strong>
            </h1>
            <hr class="divider" />
          </div>

          <div class="col-lg-8 align-self-baseline">
            <p class="text-white-75 font-weight-bold">
              <strong>간편하게 가입하고, 나만을 위한 추천레시피도 받아볼 수 있어요</strong>
            </p>
            <RouterLink class="btn btn-success btn-xl" to="/diseases">그냥 이용할래요!</RouterLink>
            <RouterLink class="btn btn-success btn-xl" to="/users/login">로그인하기</RouterLink>
            <br />
            <strong>
              <RouterLink to="/users/signup" style="color: white">회원가입 하기</RouterLink>
            </strong>
          </div>
        </div>
      </div>
    </header>


  </div>
</template>

<style scoped>

</style>