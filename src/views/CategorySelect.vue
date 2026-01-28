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
    <header class="masthead">
      <div class="container px-lg-5 h-100 text-center">
        <div class="row gx-4 gx-lg-5 h-100 align-items-center justify-content-center">
          <div class="col-lg-8 align-self-end">
            <h1 class="text-white font-weight-bold" style="padding-top: 100%">
              <strong>질환을 선택해주세요</strong>
            </h1>
            <hr class="divider" />
          </div>

          <div>
            <form @submit.prevent="searchDisease">
              <input v-model="keyword" placeholder="검색어 입력" />
              <button type="submit">검색</button>
            </form>
          </div>

          <div class="h-icon">
            <table>
              <colgroup>
                <col v-for="i in 6" :key="i" style="width:15%" />
              </colgroup>
              <tr>
                <td v-for="category in categoryData" :key="category.categoryId">
                  <a href="#" @click.prevent="scrollToCategory(category.categoryId)">
                    <img :src="category.iconUrl" width="80%" height="80%" :alt="category.categoryName" />
                    <br />
                    <label style="color:black">{{ category.categoryName }}</label>
                  </a>
                </td>
              </tr>
            </table>
          </div>
        </div>
      </div>
    </header>

    <div class="category">
      <section
          v-for="category in categoryData"
          :key="category.id"
          :id="`category-${category.categoryId}`"
      >
        <h1 class="c_title"><strong>{{ category.categoryName }}</strong></h1>
        <hr class="divider" />

        <table class="tg">
          <tbody>
          <tr v-for="disease in category.diseases" :key="disease.id">
            <td>
              <router-link :to="{
                name: 'DiseaseDetail',
                params: {
                  // categorySlug: category.categorySlug, // 현재 카테고리의 slug
                  diseaseId: disease.id       // 질환의 고유 ID
                }
              }">
                {{ disease.diseaseName }}
              </router-link>
            </td>
          </tr>
          </tbody>
        </table>
      </section>

<!--      <div v-if="Object.keys(groupedDiseases).length === 0" class="page-section">-->
<!--        <h1 class="c_title"><strong>검색결과 없음</strong></h1>-->
<!--        <hr class="divider" />-->
<!--      </div>-->
    </div>
  </div>
</template>

<style scoped>
/* 필요시 Masthead, 테이블 등 스타일 적용 */
</style>
