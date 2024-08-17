<script lang="ts" setup>
// TODO choosing record & times
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();
</script>

<template>
  <div class="text-center text-xl">
    <h1 class="font-bold text-3xl">欢迎来到社团选课系统！</h1>
    <div class="text-blue-500" v-if="userStore.token.length === 0">
      <RouterLink to="/login">点击前往登录</RouterLink>
    </div>
    <div class="text-blue-500" v-else>
      <RouterLink to="/choose">点击前往选课</RouterLink>
    </div>
  </div>
</template>
