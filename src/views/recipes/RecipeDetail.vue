<script setup>
import {ref, onMounted, computed, watch} from "vue";
import axios from "axios";
import {RouterLink, useRoute, useRouter} from "vue-router";
import NavigationBar from "@/components/NavigationBar.vue";
import { useUserStore } from '@/stores/user';
import api from '@/api';

const userStore = useUserStore();
const route = useRoute();
const router = useRouter();

const recipe = ref({});
const recommended = ref([]);
const currentUserId = ref(null);

// 레시피 상세 정보 가져오기
const fetchRecipe = async (id) => {
  console.log("id : ", id);

  const diseaseIdFromQuery = route.query.diseaseId;
  console.log("넘겨받은 질병 ID:", diseaseIdFromQuery);

  try {
    const res = await api.get(`/health/recipes/${id}`, {
      params: {
        diseaseId: diseaseIdFromQuery,
        userId: currentUserId.value
      }
    });

    recipe.value = res.data;
    console.log("레시피 상세 정보:", res.data);

    await fetchRecommended();

  } catch (err) {
    console.error("에러 발생:", err);
  }
};

const fetchRecommended = async () => {
  const diseaseId = route.query.diseaseId;
  if (!diseaseId) return;

  try {
    const res = await api.get('/health/recipes', {
      params: {
        diseaseId: diseaseId
      }
    });

    recommended.value = res.data.content || [];
    console.log("추천용 목록 로드 성공:", recommended.value);
  } catch (err) {
    console.error("추천 목록 로드 실패:", err);
  }
};

// 조리 순서의 텍스트에서 번호 부분만 분리
const getManualStepNumber = (text) => {
  if (!text) return "";
  // 텍스트를 '.' 기준으로 분리하여 첫 번째 요소(예: "1")를 반환
  return text.split(".")[0];
};

// 조리 순서의 텍스트에서 내용 부분만 분리
const getManualStepText = (text) => {
  if (!text) return "";
  // 텍스트에서 첫 번째 '.' 이후의 내용을 반환
  return text.slice(text.indexOf(".") + 1).trim();
};

const randomRecipe = computed(() => {
  const list = recommended.value;

  if (!list || list.length === 0) {
    return [];
  }

  const shuffledList = list
      .slice() // 원본 배열을 훼손하지 않기 위해 복사
      .filter(r => r.id !== recipe.value.id)
      .sort(() => 0.5 - Math.random()); // 무작위로 정렬


  console.log("recommeded.value : ", recommended.value)

  // 섞인 배열의 앞에서 최대 5개만 잘라서 반환
  return shuffledList.slice(0, 5);
});

// 즐겨찾기 추가
const addFavorite = async () => {

  if (!userStore.user) {
    alert("로그인 후 이용 가능합니다.");
    return;
  }

  const recipeId = recipe.value?.id?.toString();
  if (!recipeId) {
    alert("레시피 정보를 가져올 수 없습니다.");
    return;
  }

  const userId = userStore.user.id

  console.log("전송 데이터 확인 -> userId:", userId, "recipeId:", recipeId);

  try {
    const res = await api.post(`/health/favorites/toggle`, null, {
      params: {
        userId: userId,
        recipeId: recipeId
      },
      withCredentials: true
    });
    alert("즐겨찾기 상태가 변경되었습니다.");
  } catch (err) {
    console.error("에러 발생 상세:", err);
    alert("즐겨찾기 처리 중 오류가 발생했습니다.");
  }
};

// 추천 레시피 이동
const goToRecipe = (id) => {
  console.log("goToRecipe id : ", id)
  router.push({
    path: `/recipes/${id}`,
    query: { diseaseId: route.query.diseaseId }
  });
};

watch(
    () => route.params.recipeId,
    (newId) => {
      if (newId) {
        fetchRecipe(newId);
      }
    },
{ immediate: true } // 컴포넌트 마운트 시 즉시 실행
);

// 페이지 로드 시 레시피 정보 fetch
// onMounted에서는 watch가 처리하므로 fetchRecipe 호출 필요 없음
onMounted(() => {
  const recipeId = route.params.recipeId;
  console.log("route params : ", route.params.recipeId)

  if (!recipeId) { // recipeId가 없을 때만 경고 및 뒤로가기 처리
    alert("레시피 ID가 없습니다.");
    router.back();
  }
});
</script>

<template>
  <div class="recipe-detail-wrapper">
    <NavigationBar />

    <div v-if="recipe && recipe.recipeName">
      <header class="recipe-header">
        <div class="container h-100">
          <div class="row h-100 align-items-center justify-content-center">
            <div class="col-lg-10 text-center text-white">
              <div class="recipe-main-img-wrapper mb-4">
                <img :src="recipe.recipeThumbnail" alt="대표 이미지" class="recipe-main-img shadow" />
              </div>
              <h1 class="display-4 fw-bold">{{ recipe.recipeName }}</h1>
              <hr class="divider" />
              <div class="btn-area mt-4">
                <button class="btn btn-outline-light btn-lg rounded-pill px-4" @click="addFavorite">
                  ★ 즐겨찾기에 추가
                </button>
                <p class="mt-2 text-white-75 small">즐겨찾는 레시피는 상단 즐겨찾기 메뉴에서 확인 가능합니다.</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div class="container py-5">
        <div class="row justify-content-center">
          <div class="col-lg-9">
            <section class="mb-5 p-4 bg-light rounded shadow-sm">
              <h3 class="fw-bold mb-4">[재료]</h3>
              <p class="fs-5 lh-base">{{ recipe.ingredients }}</p>
            </section>

            <section class="instructions mb-5">
              <h3 class="fw-bold mb-4">[조리 순서]</h3>
              <div class="step-list">
                <div v-for="stepItem in recipe.manualSteps" :key="stepItem.stepNumber" class="step-card mb-4 shadow-sm border rounded p-4 d-flex align-items-start bg-white">
                  <div class="step-num me-4">{{ getManualStepNumber(stepItem.stepDescription) }}</div>
                  <div class="step-content flex-grow-1">
                    <p class="fs-5 mb-3">{{ getManualStepText(stepItem.stepDescription) }}</p>
                    <img v-if="stepItem.imageUrl" :src="stepItem.imageUrl" alt="조리 이미지" class="img-fluid rounded border" style="max-height: 400px;" />
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>

    <section class="recommend-section bg-light py-5">
      <div class="container">
        <h4 class="fw-bold mb-4 text-center">이 레시피는 어때요?</h4>
        <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-5 g-3">
          <div v-for="r in randomRecipe" :key="r.id" class="col">
            <div class="card h-100 border-0 shadow-sm rmd-card" @click="goToRecipe(r.id)" style="cursor: pointer;">
              <img :src="r.recipeThumbnail" class="card-img-top" alt="추천 레시피 이미지" style="height: 150px; object-fit: cover;" />
              <div class="card-body p-2 text-center">
                <p class="card-text fw-bold small mb-0">{{ r.recipeName }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* 상단 헤더 배경 */
.recipe-header {
  height: 80vh;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0.6) 100%),
  url("@/assets/img/test.jpg"); /* 배경 이미지 유지 */
  background-size: cover;
  background-position: center;
  margin-top: -100px; /* 네비게이션바 두께만큼 위로 */
  padding-top: 150px;
}

.recipe-main-img {
  width: 200px;
  height: 200px;
  border-radius: 50%; /* 동그랗게 */
  object-fit: cover;
  border: 4px solid white;
}

/* 조리 순서 숫자 */
.step-num {
  background-color: #f4623a;
  color: white;
  min-width: 45px;
  height: 45px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  font-size: 1.2rem;
}

/* 추천 레시피 카드 애니메이션 */
.rmd-card {
  transition: transform 0.2s;
}
.rmd-card:hover {
  transform: translateY(-5px);
}

/* 구분선 */
.divider {
  max-width: 3.25rem;
  border: 0.15rem solid #f4623a;
  margin: 1.5rem auto;
  opacity: 1;
}

.recipe-detail-wrapper {
  overflow-x: hidden;
}
</style>

