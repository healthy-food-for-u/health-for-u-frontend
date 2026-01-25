<script setup>
import NavigationBar from '@/components/NavigationBar.vue'
</script>

<template>
  <div id="app">
    <!-- 공통 내비게이션 -->
    <NavigationBar />

    <!-- 여기에서 현재 라우트의 컴포넌트(HomeView 등)가 렌더링됩니다 -->
    <router-view />
  </div>
</template>

<style scoped>
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
