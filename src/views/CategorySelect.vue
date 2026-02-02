<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import api from '@/api';

const categoryData = ref([]) // 카테고리 + 질병이 합쳐진 데이터
const keyword = ref('')

// 데이터 가져오기
onMounted(async () => {
  await fetchData();
})

// 전체 카테고리 데이터 가져오기
async function fetchData() {
  try{
    const res = await api.get('/health/diseases', {
      params : { keyword : keyword.value }
    })
    console.log("1. 전체 응답 객체:", res);
    console.log("2. 서버가 준 실제 데이터:", res.data);
    categoryData.value = res.data;
  } catch (err) {
    console.error("카테고리 목록 로드 실패:", err)
  }
}

// 검색 버튼 클릭 시
async function searchDisease() {
  await fetchData(); // 같은 함수 재사용 (keyword가 reactive하므로)
}

// 카테고리별 스크롤 이동
function scrollToCategory(slug) {
  const element = document.getElementById(`category-${slug}`)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth'})
  } else {
    console.warn(`Category section not found for slug : ${slug}`)
  }
}

</script>
<template>
  <div id="page-top">
    <header class="masthead disease-header">
      <div class="container px-lg-5">
        <div class="row gx-4 gx-lg-5 align-items-center justify-content-center text-center">
          <div class="col-lg-8">
            <h1 class="text-white font-weight-bold" style="margin-top: 150px;">
              <strong>질환을 선택해주세요</strong>
            </h1>
            <hr class="divider" />

            <div class="search-box mb-5">
              <form @submit.prevent="searchDisease" class="d-flex justify-content-center">
                <input v-model="keyword" class="form-control w-50" placeholder="질환명을 입력하세요" />
                <button type="submit" class="btn btn-primary ms-2">검색</button>
              </form>
            </div>
          </div>

          <div class="col-12 h-icon">
            <div class="d-flex justify-content-around flex-wrap mt-4">
              <div v-for="category in categoryData" :key="category.categoryId" class="m-3">
                <a href="#" @click.prevent="scrollToCategory(category.categoryId)" class="text-decoration-none">
                  <img :src="category.iconUrl" width="100" class="mb-2" :alt="category.categoryName" />
                  <br />
                  <label class="text-white fw-bold">{{ category.categoryName }}</label>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>

    <div class="category-list-container bg-white">
      <section
          v-for="category in categoryData"
          :key="category.categoryId"
          :id="`category-${category.categoryId}`"
          class="py-5 border-bottom"
      >
        <div class="container text-center">
          <h2 class="c_title mb-3"><strong>{{ category.categoryName }}</strong></h2>
          <hr class="divider-dark" />

          <div class="row justify-content-center mt-4">
            <div class="col-md-6">
              <ul class="list-group list-group-flush">
                <li v-for="disease in category.diseases" :key="disease.id" class="list-group-item border-0">
                  <router-link :to="{ name: 'DiseaseDetail', params: { diseaseId: disease.id }}" class="text-dark text-decoration-none disease-link">
                    {{ disease.diseaseName }}
                  </router-link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
/* 질환 페이지 헤더는 전체 화면을 다 차지하지 않도록 설정 */
.disease-header {
  min-height: 80vh !important; /* 100vh 대신 80vh로 줄여서 밑이 보이게 함 */
  height: auto !important;
  padding-bottom: 5rem;
}

.divider-dark {
  max-width: 3.25rem;
  border: 0.15rem solid #f4623a;
  margin: 1.5rem auto;
  opacity: 1;
}

.disease-link:hover {
  color: #f4623a !important;
  font-weight: bold;
}

.c_title {
  color: #333;
  margin-top: 2rem;
}

/* 아이콘 이미지 반응형 */
.h-icon img {
  transition: transform 0.2s;
  cursor: pointer;
}

.h-icon img:hover {
  transform: scale(1.1);
}
</style>
