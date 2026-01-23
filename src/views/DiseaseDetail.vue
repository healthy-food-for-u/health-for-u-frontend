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
  const id = route.params.diseaseId;
  if (!id) return;

  try {
    const res = await axios.get(`/api/diseases/${id}`);
    // 백엔드에서 공통 래퍼(CommonResponse 등)를 쓰지 않는다면 res.data가 바로 DTO입니다.
    disease.value = res.data;
    console.log("받아온 질병 상세 정보:", disease.value);
  } catch (err) {
    console.error("질병 정보 조회 실패:", err);
  }
}

async function fetchRecipes() {
  const id = route.params.diseaseId

  // 20개씩 끊어서 다음 페이지를 가져오기 위한 계산
  const pageNumber = Math.floor(startIndex.value / 20);

  const params = {
    diseaseId: id,
    keyword: keyword.value,
    page: pageNumber, // 서버의 Pageable.getPageNumber()로 전달됨
    size: 20          // 서버의 Pageable.getPageSize()로 전달됨
  };

  try {
    const res = await axios.get('/api/recipes', { params });

    // 중요: Spring Page 객체는 데이터를 'content'에 담아줍니다.
    cautionRecipes.value = res.data.content;

    // 전체 개수를 알아야 페이지네이션 버튼이 만들어집니다.
    totalCount.value = res.data.totalElements;
  } catch (err) {
    console.error("레시피 로딩 에러:", err);
  }
}

function searchRecipes() {
  startIndex.value = 0
  fetchRecipes()
}

function goToPage(page) {
  startIndex.value = (page - 1) * 20
  fetchRecipes()
  // 페이지 상단으로 스크롤
  window.scrollTo(0, 0);
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
          <span class="d_name">{{ disease.diseaseName }}</span>입니다.
        </div>
      </div>

      <div class="caution">
        <h2><strong>⚠️ 주의해야 할 음식</strong></h2>
        <hr class="divider" />
        <div v-if="disease.caution" class="caution_list">
          {{ disease.caution }}
        </div>
        <div v-else class="text-muted">등록된 주의사항 정보가 없습니다.</div>
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
              <div v-for="recipe in cautionRecipes" :key="recipe.id"

                   style="width: 25%; padding-left: 15px; padding-right: 10px;"
                   class="mb-4"
              >
                <div class="item">
                  <div class="card h-100">
                    <RouterLink :to="`/recipes/${recipe.id}`">
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