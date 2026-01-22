<script setup>
import {ref, onMounted, computed, watch} from "vue";
import axios from "axios";
import {RouterLink, useRoute, useRouter} from "vue-router";
import NavigationBar from "@/components/NavigationBar.vue";

const route = useRoute();
const router = useRouter();

const recipe = ref({});
const recommended = ref([]);

// API 호출: 레시피 상세 정보 가져오기
const fetchRecipe = async (id) => {
  try {
    const res = await axios.get(`/api/recipes/${id}`);
    recipe.value = res.data.recipe;
    console.log("res.data : ", res.data)

    recommended.value = res.data.cautionRecipes || [];
  } catch (err) {
    console.error(err);
    alert("레시피 정보를 불러오는 데 실패했습니다.");
    recipe.value = null
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
  // recommended.value는 현재 질병과 관련된 '다른' 레시피들의 목록 (배열)입니다.
  const list = recommended.value;

  if (!list || list.length === 0) {
    return [];
  }

  const shuffledList = list
      .slice() // 원본 배열을 훼손하지 않기 위해 복사
      .sort(() => 0.5 - Math.random()); // 무작위로 정렬


  console.log("recommeded.value : ", recommended.value)

  // 섞인 배열의 앞에서 최대 5개만 잘라서 반환
  return shuffledList.slice(0, 5);
});

// 즐겨찾기 추가
const addFavorite = async () => {
  if (!recipe.value._id) {
    alert("레시피 정보가 아직 로드되지 않았습니다.");
    return;
  }

  const recipeId = recipe.value._id.toString(); // ObjectId를 문자열로 변환
  console.log("[addFavorite] recipeId : ", recipe.value._id.toString())

  try {
    const res = await axios.post(`/api/recipes/${recipeId}/favorite`, {
      // 서버에서 req.params.recipeId로 ID를 이미 받으므로,
      // 요청 본문(body)에 ID를 또 보낼 필요는 없지만, 안전을 위해 유지할 수 있음
    });

    console.log("[addFavorite] res.data.result : ", res.data.result )

    // 백엔드 응답 처리 (로그인 필요 응답 포함)
    alert(res.data.result === "success" ? "즐겨찾기에 추가됨" : res.data.result); // 로그인 후 이용해주세요 또는 즐겨찾기 추가 실패 메시지

  } catch (err) {
    console.error(err);
    alert("즐겨찾기 추가 실패");
  }
};

// 추천 레시피 이동
const goToRecipe = (id) => {
  console.log("goToRecipe id : ", id)
  router.push(`/recipes/${id}`);
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
  <div class="recipe-detail">

    <!-- Navigation -->
     <NavigationBar />

    <div v-if="recipe && recipe.recipeName">
      <!-- 레시피 제목 + 대표 이미지 + 즐겨찾기 버튼 -->
      <div class="title">
        <img :src="recipe.recipeThumbnail" alt="대표 이미지" />
        <h1>{{ recipe.recipeName }}</h1>
        <button class="add" @click="addFavorite">즐겨찾기에 추가</button>
        <h6>즐겨찾는 레시피는 왼쪽에 있는 ★을 클릭하면 보여요!</h6>
      </div>

      <!-- 재료 -->
      <section class="ingredients">
        <h2>[재료]</h2>
        <p>{{ recipe.ingredients }}</p>
        <hr class="divider" />
      </section>

      <section class="instructions">
        <h2>[조리 순서]</h2>
        <div class="cooking">
          <div v-for="stepItem in recipe.manualSteps" :key="stepItem.step">

            <span class="num">{{ getManualStepNumber(stepItem.text) }}</span>
            {{ getManualStepText(stepItem.text) }}
            <br />

            <img
                v-if="stepItem.imageUrl"
                :src="stepItem.imageUrl"
                alt="조리 이미지"
            />
          </div>
        </div>
      </section>
    </div>

    <!-- 추천 레시피 -->
    <section class="recommend">
      <div class="layout">
        <article>
          <div class="card-header">
            <span style="margin-left:5rem;">이 레시피는 어때요?</span>
          </div>
          <table class="flexbox">
            <tr>
              <td
                  v-for="r in randomRecipe"
                  :key="r._id"
                  class="rmd_item"
                  @click="goToRecipe(r._id)"
              >
                <img :src="r.recipeThumbnail" alt="추천 레시피 이미지" />
                <br />
                <span class="recipe-link">{{ r.recipeName }}</span>
              </td>
            </tr>
          </table>
        </article>
      </div>
    </section>

  </div>
</template>



