<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores/user'

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
    const res = await axios.get(`/api/favorites`, {
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
body,
ul,
li {
  padding: 0;
  margin: 0;
  list-style: none;
}

a {
  color: inherit;
  text-decoration: none;
}

.left-side-bar {
  background-color: gray;
  opacity: 0.8;
  margin-top: 10rem;
  height: 5%;
  width: 12rem;
  position: fixed;
  left: -150px;
  transition: left 0.3s;
  overflow: auto;
  z-index: 1;
}

.left-side-bar > .status-ico {
  text-align: right;
  padding: 10px;
}

.left-side-bar ul {
  font-weight: bold;
  text-align: center;
  padding: 0;
}

.left-side-bar ul > li > a {
  display: block;
  padding: 10px;
  white-space: nowrap;
}

.left-side-bar:hover {
  left: 0;
  opacity: 1;
  height: 90%;
  margin-top: 4.6rem;
  background-color: #fff;
}

.left-side-bar ul > li:hover > a {
  color: black;
  background-color: lightgray;
}

.left-side-bar ul > li img {
  width: 100px;
  border-radius: 6px;
}
</style>
