<script lang="ts" setup>
import router from '@/router/index';

setTimeout(() => {
  router.push('/');
}, 3000);
</script>

<template>
  <div class="flex flex-col min-h-[70vh] gap-4 py-8 items-center justify-center">
    <div class="text-center text-5xl font-bold">您的报名已提交成功！</div>
    <img src="/img/thanks-bird.jpg">
    <div class="text-center text-lg mt-2">3 秒后自动跳回主页查看选课情况</div>
  </div>
</template>
