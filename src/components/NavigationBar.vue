<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import FavoriteSidebar from './FavoriteSidebar.vue'
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const showFavorites = ref(false)

onMounted(() => {
  console.log("현재 로그인된 유저 정보:", user.value)
})

function logout() {
  userStore.logout()
}

function toggleFavorites() {
  showFavorites.value = !showFavorites.value
}
</script>

<template>
  <nav class="navbar">
    <div class="container">
      <img src="src/assets/img/logoo.png" class="logo" />
      <RouterLink class="navbar-brand" to="/diseases">Healthy Food For U</RouterLink>

      <div class="nav-right">
        <template v-if="userStore.user">
          <span class="user">안녕하세요, {{ userStore.user.userName }}님!</span>
          <button id="favorite" @click="toggleFavorites">즐겨찾기 ★</button>
          <button id="logout" @click="logout">로그아웃</button>
        </template>

        <template v-else>
          <RouterLink class="navbar-brand" to="/auth/signup">회원가입</RouterLink>
          <RouterLink class="navbar-brand" to="/auth/login">로그인</RouterLink>
        </template>
      </div>

      <RouterLink class="navbar-brand" to="#">▲top▲</RouterLink>
    </div>

    <!-- 로그인한 경우에만 사이드바 표시 -->
    <FavoriteSidebar v-if="userStore.user && showFavorites" />
  </nav>
</template>



<style scoped>
.navbar {
  background-color: rgba(189, 189, 189, 0.5);
  position: fixed;
  width: 100%;
  top: 0;
  z-index: 10;
  display: flex;
  justify-content: space-between;
  padding: 1rem;
}

.logo {
  width: 50px;
  margin-right: 1rem;
}

.navbar-brand {
  color: white;
  text-decoration: none;
  font-weight: 700;
  opacity: 0.8;
}

.navbar-brand:hover {
  opacity: 1;
}

#logout {
  border: none;
  outline: none;
  background: none;
  color: #fff;
  font-weight: 700;
  opacity: 0.8;
  cursor: pointer;
}

#logout:hover {
  opacity: 1;
}

.user {
  color: #fff;
  margin-right: 1rem;
}
</style>
