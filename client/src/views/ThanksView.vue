<script lang="ts" setup>
import router from '@/router/index';

setTimeout(() => {
  router.push('/');
}, 5000);
</script>

<template>
  <div class="flex flex-col min-h-[70vh] gap-8 py-8 items-center justify-center">
    <div class="text-center text-5xl font-bold">您的报名已提交成功！</div>
    <img src="/img/thanks-bird.jpg" class="w-48">
    <div class="text-center text-lg mt-2">5 秒后自动跳回主页查看选课情况</div>
  </div>
</template>
