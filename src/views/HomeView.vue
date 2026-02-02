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
    <NavigationBar />
    <header class="masthead">
      <div class="container px-lg-5 h-100">
        <div class="row gx-4 gx-lg-5 h-100 align-items-center justify-content-center text-center">
          <div class="col-lg-8 align-self-end">
            <h1 class="text-white font-weight-bold">
              질환별 식단관리,<br />이제 간단하게 찾아보세요!
            </h1>
            <hr class="divider" />
          </div>
          <div class="col-lg-8 align-self-baseline">
            <p class="text-white-75 mb-5">
              간편하게 가입하고, 나만을 위한 추천레시피도 받아볼 수 있어요
            </p>
            <RouterLink class="btn btn-success btn-xl" to="/diseases">그냥 이용할래요!</RouterLink>
            <RouterLink class="btn btn-success btn-xl" to="/auth/login">로그인하기</RouterLink>
          </div>
        </div>
      </div>
    </header>
  </div>
</template>

<style>
@import "@/assets/css/styles.css";

/* 1. 부트스트랩 그리드 강제 활성화 (세로 늘어짐 방지) */
.container {
  width: 100% !important;
  padding-right: var(--bs-gutter-x, 0.75rem);
  padding-left: var(--bs-gutter-x, 0.75rem);
  margin-right: auto;
  margin-left: auto;
}

.row {
  display: flex !important; /* 가로 정렬 강제 */
  flex-wrap: wrap !important;
  margin-top: calc(-1 * var(--bs-gutter-y));
  margin-right: calc(-0.5 * var(--bs-gutter-x));
  margin-left: calc(-0.5 * var(--bs-gutter-x));
}

.col-lg-8 {
  flex: 0 0 auto !important;
  width: 66.66666667% !important; /* 가로 8칸 너비 강제 */
}

.justify-content-center {
  justify-content: center !important;
}

.align-items-center {
  align-items: center !important;
}

/* 2. 배경 이미지 설정 (이미 잘 나온다고 하신 부분) */
.masthead {
  display: flex !important;
  align-items: center !important;
  padding-top: 10rem;
  padding-bottom: calc(10rem - 4.5rem);
  background: linear-gradient(to bottom, rgba(92, 77, 66, 0.8) 0%, rgba(92, 77, 66, 0.8) 100%),
  url("@/assets/img/photo.jpg") !important;
  background-position: center !important;
  background-repeat: no-repeat !important;
  background-size: cover !important;
  height: 100vh;
}

/* 3. 버튼 간격 보정 */
.btn-xl {
  margin: 10px;
  padding: 1.25rem 2.25rem;
  border-radius: 10rem;
}
</style>