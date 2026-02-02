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

<style>

#app-container {
  width: 100%;
  margin: 0;
  padding: 0;
}

body {
  margin: 0;
  font-family: 'Merriweather Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}
</style>
