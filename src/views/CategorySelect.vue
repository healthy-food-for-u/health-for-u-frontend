<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

const diseases = ref([])
const categories = ref([])
const keyword = ref('')

// 데이터 가져오기
onMounted(async () => {
// 카테고리 로드 (메뉴/필터용)
  await fetchCategories();

  // 전체 질병 목록 로드 (본문 목록용)
  await fetchAllDiseases();
})

// 전체 카테고리 데이터 가져오기
async function fetchCategories() {
  try{
    const res = await axios.get('/api/categories')
    categories.value = res.data.data || [];
  } catch (err) {
    console.error("카테고리 목록 로드 실패:", err)
  }
}

// 전체 질병 데이터 가져오기
async function fetchAllDiseases() {
  try{
    const res = await axios.get("/api/diseases")

    const fetchedData = res.data.data;
    // 이제 fetchedData 배열의 각 요소는 categorySlug 필드를 포함
    diseases.value = Array.isArray(fetchedData) ? fetchedData : [];
    console.log("잘 들어왔니~ : ", diseases.value)
  } catch (err) {
    console.error("질병 목록 로드 실패:", err)
    diseases.value = [];
  }
}

// 질병 검색
async function searchDisease() {
  try {
    const res = await axios.get('/api/diseases/search', {
      params: { search: keyword.value } //TODO : search인지 q인지 보기
    })
    diseases.value = res.data

    // TODO: 검색 결과가 있는 경우, 해당 질환이 있는 목록으로 스크롤 이동 로직 추가 (DOM 참조 필요)

  } catch (err) {
    console.error(err)
  }
}

// 전체 질병 목록을 카테고리 Slug 기준으로 그룹화하는 계산 속성
const groupedDiseases = computed(() => {
  if (!Array.isArray(diseases.value) || diseases.value.length === 0) {
    return {};
  }

  // diseases 배열을 reduce를 사용하여 { 'slug1': [disease1, ...], 'slug2': [...] } 형태로 변환
  return diseases.value.reduce((groups, disease) => {
    // 백엔드에서 질병 문서에 categorySlug 필드를 포함하여 전송해야 함
    const slug = disease.categorySlug;
    if (slug) {
      if (!groups[slug]) {
        groups[slug] = [];
      }
      groups[slug].push(disease);
    }
    return groups;
  }, {});
});

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
                <td v-for="category in categories" :key="category.slug">
                  <a href="#" @click.prevent="scrollToCategory(category.slug)">
                    <img :src="category.iconUrl" width="80%" height="80%" :alt="category.name" />
                    <br />
                    <label style="color:black">{{ category.name }}</label>
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
          v-for="category in categories"
          :key="category.slug"
          :id="`category-${category.slug}`"
      >
        <h1 class="c_title"><strong>{{ category.name }}</strong></h1>
        <hr class="divider" />

        <table class="tg">
          <tbody>
          <tr v-for="disease in groupedDiseases[category.slug]" :key="disease._id">
            <td>
              <router-link :to="{
                name: 'DiseaseDetail',
                params: {
                  // categorySlug: category.categorySlug, // 현재 카테고리의 slug
                  diseaseId: disease._id       // 질환의 고유 ID
                }
              }">
                {{ disease.name }}
              </router-link>
            </td>
          </tr>
          </tbody>
        </table>
      </section>

      <div v-if="Object.keys(groupedDiseases).length === 0" class="page-section">
        <h1 class="c_title"><strong>검색결과 없음</strong></h1>
        <hr class="divider" />
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 필요시 Masthead, 테이블 등 스타일 적용 */
</style>
