<script lang="ts" setup>
import router from '@/router/index';

setTimeout(() => {
  router.push('/');
}, 2000);
</script>

<template>
  <div>
    <div class="text-center text-5xl font-bold">您的报名已提交成功！</div>
    <div class="text-center text-lg mt-2">2 秒后自动跳回主页查看选择情况</div>
  </div>
</template>
