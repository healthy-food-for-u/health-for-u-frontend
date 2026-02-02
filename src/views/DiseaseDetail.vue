<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import axios from 'axios'
import RecipeSearchBox from "@/components/RecipeSearchBox.vue";
import api from '@/api'

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
    const res = await api.get(`/health/diseases/${id}`);
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
    const res = await api.get('/health/recipes', { params });

    cautionRecipes.value = res.data.content;

    totalCount.value = res.data.totalElements;
  } catch (err) {
    console.error("레시피 로딩 에러:", err);
  }
}

function searchRecipes() {
  // 주의 성분인지 먼저 확인
  if (keyword.value.trim() !== '') {

    const cautionData = disease.value.caution || "";
    let isCaution = false;

    if (Array.isArray(cautionData)) {

      isCaution = cautionData.some(ingredient =>
          keyword.value.includes(ingredient) || ingredient.includes(keyword.value)
      );
    } else if (typeof cautionData === 'string') {
      isCaution = cautionData.includes(keyword.value.trim());
    }

    if (isCaution) {
      alert(`⚠️ '${keyword.value}'(은)는 현재 질병에 주의해야 할 성분입니다!\n 검색 결과 내에서 주의 표시를 꼭 확인하세요.`);
    }
  }
  startIndex.value = 0
  fetchRecipes()
}

function goToPage(page) {
  startIndex.value = (page - 1) * 20
  fetchRecipes()
  // 페이지 상단으로 스크롤
  window.scrollTo(0, 0);
}

onMounted(async () => {
  await fetchDiseaseData()
  await fetchRecipes()
})
</script>

<template>
  <div id="recipe-list">
    <header class="masthead detail-header">
      <div class="container h-100">
        <div class="row h-100 align-items-center justify-content-center text-center">
          <div class="col-lg-10">
            <h1 class="text-white font-weight-bold">
              선택하신 질환은<br />
              <span class="d_name text-warning">{{ disease.diseaseName }}</span>입니다.
            </h1>
            <hr class="divider" />
          </div>
        </div>
      </div>
    </header>

    <div class="container py-5">
      <div class="row justify-content-center">
        <div class="col-lg-10 text-center">
          <h2 class="section-title"><strong>⚠️ 주의해야 할 음식</strong></h2>
          <hr class="divider-dark" />
          <div class="caution-box">
            <div v-if="disease.caution" class="caution-text">
              {{ disease.caution }}
            </div>
            <div v-else class="text-muted">등록된 주의사항 정보가 없습니다.</div>
          </div>
        </div>
      </div>

      <div class="search-box mb-5 mt-5">
        <form @submit.prevent="searchRecipes" class="d-flex justify-content-center">
          <input
              v-model="keyword"
              type="text"
              class="form-control w-50"
              placeholder="레시피 이름을 입력하세요"
          />
          <button type="submit" class="btn btn-primary ms-2 px-4">검색</button>
        </form>
      </div>
    </div>

    <section class="recipe-results py-5">
      <div class="container">
        <h5 class="mb-4 fw-bold">총 {{ totalCount }}개의 레시피가 있습니다.</h5>
        <div class="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
          <div v-for="recipe in cautionRecipes" :key="recipe.id" class="col">
            <div class="card h-100 border-0 shadow-sm recipe-card">
              <RouterLink :to="`/recipes/${recipe.id}?diseaseId=${disease.id}`" class="text-decoration-none text-dark">
                <img :src="recipe.recipeThumbnail" class="card-img-top" alt="레시피 이미지" />
                <div class="card-body">
                  <div class="text-center fw-bolder">{{ recipe.recipeName }}</div>
                </div>
              </RouterLink>
            </div>
          </div>
        </div>

        <nav aria-label="Page navigation" class="mt-5">
          <ul class="pagination justify-content-center">
            <li v-if="currentStartPage > 1" class="page-item">
              <button class="page-link" @click="goToPage(currentStartPage - 5)">이전</button>
            </li>
            <li v-for="page in visiblePages" :key="page" :class="['page-item', { active: currentPage === page }]">
              <button class="page-link" @click="goToPage(page)">{{ page }}</button>
            </li>
            <li v-if="hasNextGroup" class="page-item">
              <button class="page-link" @click="goToPage(currentStartPage + 5)">다음</button>
            </li>
          </ul>
        </nav>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* 상단 헤더 배경 (1번 사진 느낌) */
.detail-header {
  height: 50vh !important;
  min-height: 400px;
  background: linear-gradient(to bottom, rgba(92, 77, 66, 0.7) 0%, rgba(92, 77, 66, 0.7) 100%),
  url("@/assets/img/rec.jpg") !important; /* 이미지 경로 확인 필요 */
  background-position: center !important;
  background-size: cover !important;
  display: flex;
  align-items: center;
}

.d_name {
  font-size: 3.5rem;
  font-weight: 800;
  color: #ffc107 !important; /* 골다공증 글씨 색상 */
}

/* 주의사항 박스 디자인 (초록색 테두리) */
.caution-box {
  border: 2px solid #198754;
  border-radius: 10px;
  padding: 20px;
  margin-top: 20px;
  background-color: #f8f9fa;
}

.caution-text {
  font-size: 1.1rem;
  color: #333;
  word-break: keep-all;
}

/* 검색창 스타일 */

.search-bar .btn {
  border-radius: 0 50px 50px 0;
}

/* 레시피 카드 스타일 */
.recipe-card {
  transition: transform 0.3s;
}
.recipe-card:hover {
  transform: translateY(-10px);
}
.recipe-card img {
  height: 250px;
  object-fit: cover;
  border-radius: 5px 5px 0 0;
}

/* 구분선 */
.divider {
  max-width: 3.25rem;
  border: 0.15rem solid #f4623a;
  margin: 1.5rem auto;
  opacity: 1;
}
.divider-dark {
  max-width: 3.25rem;
  border: 0.15rem solid #f4623a;
  margin: 1rem auto;
  opacity: 1;
}

.section-title {
  color: #2c3e50;
}
</style>