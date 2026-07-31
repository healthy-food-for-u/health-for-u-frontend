<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores/user'
import api from '@/api'

const showList = ref(false)
const favoriteRecipes = ref([])
const router = useRouter()
const userStore = useUserStore()
const { user } = storeToRefs(userStore)

watch(user, async (newUser) => {
  if (newUser && newUser.id) {
    await fetchFavorites(newUser.id)
  } else {
    favoriteRecipes.value = []
  }
})

onMounted(async () => {
  if (user.value && user.value.id) {
    await fetchFavorites(user.value.id)
  }
})

async function fetchFavorites(userId) {
  if (!userId) return;

  try {
    const res = await api.get(`/health/favorites`, {
      params: { userId: userId },
      withCredentials: true
    })
    console.log("즐겨찾기 res : ", res.data)
    favoriteRecipes.value = res.data
  } catch (e) {
    console.error('즐겨찾기 목록 불러오기 실패:', e)
  }
}

function goToRecipe(id) {
  router.push(`/recipes/${id}`)
}
</script>

<template>
  <div class="left-side-bar" @mouseenter="showList = true" @mouseleave="showList = false">
    <div class="status-ico">
      <span>즐겨찾는 레시피</span>
    </div>

    <ul v-if="showList">
      <li v-for="recipe in favoriteRecipes" :key="recipe.recipeId">
        <a @click.prevent="goToRecipe(recipe.recipeId)">
          <img :src="recipe.recipeThumbnail" alt="thumbnail" />
          <br />
          {{ recipe.recipeName }}
        </a>
      </li>
    </ul>
  </div>
</template>

<style scoped>
ul, li {
  padding: 0;
  margin: 0;
  list-style: none;
}

a {
  color: inherit;
  text-decoration: none;
  cursor: pointer;
}

/* 사이드바 전체 컨테이너 */
.left-side-bar {
  position: fixed;
  top: 80px; /* 상단바 위치에 맞게 조절 */
  left: 0;
  width: 200px; /* 버튼과 리스트가 차지할 기본 고정 너비 */
  z-index: 999;
}

/* "즐겨찾는 레시피" 타이틀/버튼 부분 */
.left-side-bar > .status-ico {
  text-align: center;
  padding: 12px;
  font-weight: bold;
  background-color: #555;
  color: white;
  border-radius: 4px;
  cursor: pointer;
}

/* 즐겨찾기 목록이 버튼 바로 밑에 아래로 떨어지도록 설정 */
.left-side-bar ul {
  display: none; /* 평소엔 숨김 */
  position: absolute;
  top: 100%; /* 버튼 바로 아래에 위치 */
  left: 0;   /* 버튼 왼쪽 라인에 딱 맞춤 */
  width: 100%; /* 버튼 너비와 똑같이 맞춤 (원하면 더 넓게 지정해도 됨) */
  background-color: #ffffff;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  margin-top: 4px; /* 버튼과의 살짝 간격 */

  max-height: 400px;
  overflow-y: auto;
  z-index: 1000;
}

/* 마우스를 올렸을 때 ul을 보여줌 */
.left-side-bar:hover ul {
  display: block;
}

/* 개별 레시피 항목 스타일 */
.left-side-bar ul > li {
  border-bottom: 1px solid #eee;
}

.left-side-bar ul > li:last-child {
  border-bottom: none;
}

.left-side-bar ul > li > a {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px;
  text-align: center;
}

.left-side-bar ul > li:hover > a {
  background-color: #f9f9f9;
  color: #333;
}

/* 썸네일 이미지 크기 고정 */
.left-side-bar ul > li img {
  width: 70px;
  height: 70px;
  object-fit: cover;
  border-radius: 6px;
  margin-bottom: 6px;
}
</style>
