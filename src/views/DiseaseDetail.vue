<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import axios from 'axios'
import RecipeSearchBox from "@/components/RecipeSearchBox.vue";

const route = useRoute()

const disease = ref({})
const cautionRecipes = ref([])
const totalCount = ref(0)
const keyword = ref('')
const startIndex = ref(0)

const currentPage = computed(() => Math.floor(startIndex.value / 20) + 1)
const currentStartPage = computed(() => Math.floor((currentPage.value - 1) / 5) * 5 + 1)
// 현재 페이지 그룹에 속하는 페이지 번호 목록을 생성
const visiblePages = computed(() => {
  const pages = []
  for (let i = currentStartPage.value; i < currentStartPage.value + 5; i++) {
    if ((i - 1) * 20 < totalCount.value) pages.push(i)
  }
  return pages
})
const hasNextGroup = computed(() => currentStartPage.value * 20 < totalCount.value)

async function fetchDiseaseData() {
  console.log("route.params : ", route.params)
  const id = route.params.diseaseId
  if (!id) {
    console.error("Error: diseaseId is missing from route parameters.")
    return // ID가 없으면 API 호출 방지
  }
  const res = await axios.get(`/api/diseases/${id}`)
  disease.value = res.data.data
  console.log("disease.value : ", disease.value)
}

async function fetchRecipes() {
  const id = route.params.diseaseId

  const params = {
    startIndex: startIndex.value,
    search: keyword.value
    // 백엔드가 diseaseId를 쿼리 파라미터로 받지 않고 URL 경로에서 받는다면, 여기에 diseaseId를 추가할 필요는 없습니다.
  };

  console.log("startIndex : ", startIndex.value )
  console.log("keyword : ", keyword.value)

  try{
    const res = await axios.get(`/api/diseases/${id}/caution-recipes`, {params})
    const { recipes: fetchedRecipes, totalCount: fetchedTotalCount } = res.data.data
    console.log("fetchedRecipes 배열 확인 : ", res.data.data)

    if(Array.isArray(fetchedRecipes)){
      cautionRecipes.value = fetchedRecipes

      totalCount.value = fetchedTotalCount
    } else {
      cautionRecipes.value = []
      totalCount.value = 0
      console.error("레시피 데이터가 배열 형식이 아닙니다.")
    }
  } catch (err) {
    console.error("주의 레시피 조회 오류:", err)
  }

}

function searchRecipes() {
  startIndex.value = 0
  fetchRecipes()
}

function goToPage(page) {
  startIndex.value = (page - 1) * 20
  fetchRecipes()
}

function handleSearchResults(recipes) {
  cautionRecipes.value = recipes
  totalCount.value = recipes.length
}

onMounted(async () => {
  await fetchDiseaseData()
  await fetchRecipes()
})
</script>

<template>
  <div id="recipe-list">
    <Navigation />
    <div class="all" style="padding-top: 200px">
      <div class="list-header">
        <div class="title_div">
          선택하신 질환은<br />
          <span class="d_name">{{ disease.name }}</span>입니다.
        </div>
      </div>

      <div class="caution">
        <h2><strong>주의해야 할 음식</strong></h2>
        <hr class="divider" />
        <div class="caution_list">{{ disease.caution }}</div>
      </div>

      <!-- 검색창 -->
      <h1>레시피 검색</h1>
      <RecipeSearchBox @search="handleSearchResults" />

       레시피 결과
      <div class="result">
        <section>
          <div class="rec_list">
            <h5>총 {{ totalCount }}개의 레시피가 있습니다.</h5>

            <div
                style="display: flex; flex-wrap: wrap; margin-left: -15px; margin-right: 30px;"
            >
              <div v-for="recipe in cautionRecipes" :key="recipe._id"

                   style="width: 25%; padding-left: 15px; padding-right: 10px;"
                   class="mb-4"
              >
                <div class="item">
                  <div class="card h-100">
                    <RouterLink :to="`/recipes/${recipe._id}`">
                      <img :src="recipe.recipeThumbnail" alt="레시피 이미지" style="height:20rem;" />
                      <div class="card-body p-4">
                        <div class="text-center fw-bolder">{{ recipe.recipeName }}</div>
                      </div>
                    </RouterLink>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- 페이지네이션 -->
        <div class="container" style="padding-bottom:50px;">
          <ul class="pagination justify-content-center">

            <li v-if="currentStartPage > 1" class="page-item">
              <button class="page-link" @click="goToPage(currentStartPage - 5)">이전</button>
            </li>

            <li
                v-for="page in visiblePages"
                :key="page"
                :class="['page-item', { active: currentPage === page }]"
            >
              <button class="page-link" @click="goToPage(page)">{{ page }}</button>
            </li>

            <li v-if="hasNextGroup" class="page-item">
              <button class="page-link" @click="goToPage(currentStartPage + 5)">다음</button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>