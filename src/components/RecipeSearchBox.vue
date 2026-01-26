<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import api from '@/api'

const emit = defineEmits(['search'])

const router = useRouter()
const searchKeyword = ref('')

const searchRecipes = async () => {
  try {
    const res = await axios.get(`/health/recipes?name=${encodeURIComponent(searchKeyword.value)}`)
    const recipes = res.data.recipes || []
    // 검색 결과를 부모에게 전달
    emit('search', recipes)
  } catch (err) {
    console.error(err)
    recipes.value = []
  }
}

</script>

<template>
  <div class="recipe-search-box">
    <input type="text" v-model="searchKeyword" placeholder="검색어 입력" />
    <button @click="searchRecipes">검색</button>
  </div>
</template>

<style scoped>
.recipe-search-box {
  margin: 1rem 0;
}
</style>
