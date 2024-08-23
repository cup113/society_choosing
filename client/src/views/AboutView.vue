<script lang="ts" setup>
import { Button } from '@/components/ui/button';
import router from '@/router/index';

function go_home() {
    router.push('/');
}
</script>

<template>
  <div class="flex flex-col gap-y-4 max-w-96 mx-auto my-4 p-4 bg-white rounded-2xl">
    <h1 class="text-2xl font-bold">贡献者 / Contributors</h1>
    <ul>
        <li>前后端程序开发: 2604 李牧</li>
        <li>UI 设计 / 绘画: 2604 罗睿淇</li>
        <li>需求沟通: 金典、王玉璇</li>
    </ul>
    <h1 class="text-2xl font-bold">服务 / Services</h1>
    <ul>
        <li>云服务器: 华为云</li>
        <li>资金支持: 华东师范大学第二附属中学（宝山校区）</li>
    </ul>
    <h1 class="text-2xl font-bold">第三方库 / Third-party libraries</h1>
    <ul>
        <li>前后端框架: Vue 3, ViteExpress</li>
        <li>UI 框架: shadcn-vue</li>
        <li>数据库系统: PocketBase</li>
        <li>工具库: TailwindCSS, vueuse, clsx, vue-router, winston, xlsx</li>
    </ul>
    <Button @click="go_home">返回主页</Button>
  </div>
</template>
