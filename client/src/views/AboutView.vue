<script lang="ts" setup>
import { Button } from '@/components/ui/button';
import router from '@/router/index';

function go_home() {
  router.push('/');
}
</script>

<template>
  <div class="flex flex-col gap-y-4 max-w-72 sm:max-w-96 mx-auto my-4 p-4 rounded-2xl bg-amber-100">
    <h1 class="text-2xl font-bold">贡献者 / Contributors</h1>
    <ul class="text-lg">
      <li>前后端程序开发: <b>2604 李牧</b></li>
      <li>UI 设计 / 绘画: <b>2604 罗睿淇</b></li>
      <li>需求沟通: <b>金典</b>（老师）、<b>王玉璇</b>（老师）</li>
    </ul>
    <h1 class="text-2xl font-bold">服务 / Services</h1>
    <ul>
      <li>云服务器: 华为云 Flexus L</li>
      <li>资金支持: 华东师范大学第二附属中学（宝山校区）</li>
    </ul>
    <h1 class="text-2xl font-bold">第三方库 / Third-party libraries</h1>
    <ul>
      <li>部署工具：Coolify (Docker)</li>
      <li>前后端框架: Vue 3 (Vite), Express.js</li>
      <li>UI 框架: shadcn-vue</li>
      <li>数据库系统: PocketBase</li>
      <li>工具库: TailwindCSS, vueuse, vue-router, clsx, priority-queue, winston, xlsx</li>
    </ul>
    <Button @click="go_home">返回主页</Button>
  </div>
</template>
