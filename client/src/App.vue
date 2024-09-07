<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router';
import { computed } from 'vue';

import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
} from '@/components/ui/navigation-menu';

import { AlertDialog, AlertDialogHeader, AlertDialogTitle, AlertDialogContent, AlertDialogFooter, AlertDialogAction } from '@/components/ui/alert-dialog';

import { useUserStore } from './stores/user';
import { useSocietyStore } from './stores/society';
import { useNow } from '@vueuse/core';
import { useErrorStore } from './stores/error';

const userStore = useUserStore();
const societyStore = useSocietyStore();
const errorStore = useErrorStore();

const name = computed(() => userStore.userInformation.name);
const role = computed(() => userStore.userInformation.role);
const loginNavText = computed(() => name.value ? `账号 (${name.value})` : '登录')

function clear_local_storage_cache() {
  localStorage.clear();
  location.reload();
}

const now = useNow({
  interval: 50,
});

const estimated = computed(() => societyStore.timeStatus?.open === false && societyStore.timeStatus.reason === 'not-started' ? societyStore.timeStatus.estimated.format("MM-DD HH:mm:ss") : undefined);

const reason = computed(() => societyStore.timeStatus && !societyStore.timeStatus.open ? societyStore.timeStatus.reason : undefined);

const remainingEta = computed(() => {
  if (societyStore.timeStatus?.open !== true || societyStore.timeStatus.estimatedMaintain === undefined) {
    return;
  }
  const s = societyStore.timeStatus.estimatedMaintain.diff(now.value.getTime(), 's');
  if (s > 10 * 60) {
    return;
  }
  return s.toFixed(0);
})

const eta = computed(() => {
  if (societyStore.timeStatus?.open !== false || societyStore.timeStatus.reason !== 'not-started') {
    return 0;
  }
  const ms = societyStore.timeStatus.estimated.diff(now.value.getTime());
  if (ms <= 0) {
    societyStore.timeStatus = { open: true, estimatedEnd: societyStore.timeStatus.estimated };
  }
  if (ms < 1000) {
    return `${ms}毫秒`
  }
  if (ms < 10000) {
    return `${(ms / 1000).toFixed(1)}秒`
  }
  if (ms < 60000) {
    return `${(ms / 1000).toFixed(0)}秒`
  }
  let sec = Math.floor(ms / 1000);
  let min = Math.floor(sec / 60);
  let hour = Math.floor(min / 60);
  sec = sec % 60;
  min = min % 60;
  if (ms < 60000 * 60) {
    return `${min}分钟 ${sec}秒`
  }
  return `${hour}小时 ${min}分钟 ${sec}秒`
})
</script>

<template>
  <div class="flex flex-col min-h-screen gap-4">
    <header class="flex flex-col md:flex-row gap-2 justify-between items-center bg-amber-700 text-amber-700 pl-2">
      <h1 class="border text-2xl border-gray-300 rounded-md bg-white font-bold px-4 py-2">华二宝山社团选课系统</h1>
      <NavigationMenu>
        <NavigationMenuList class="flex-wrap py-4 gap-2 md:gap-0 text-white">
          <NavigationMenuItem
            class="py-1 px-3 min-w-20 text-center md:border-l-2 border-white border-dashed bg-amber-600 rounded-md md:bg-transparent md:rounded-none">
            <RouterLink to="/">{{ loginNavText }}</RouterLink>
          </NavigationMenuItem>
          <NavigationMenuItem
            class="py-1 px-3 min-w-20 text-center md:border-l-2 border-white border-dashed bg-amber-600 rounded-md md:bg-transparent md:rounded-none"
            v-if="role === 'student'">
            <RouterLink to="/choose" class="font-bold">选课</RouterLink>
          </NavigationMenuItem>
          <NavigationMenuItem
            class="py-1 px-3 min-w-20 text-center md:border-l-2 border-white border-dashed bg-amber-600 rounded-md md:bg-transparent md:rounded-none"
            v-if="role === 'teacher'">
            <RouterLink to="/export">导出数据</RouterLink>
          </NavigationMenuItem>
          <NavigationMenuItem
            class="py-1 px-3 min-w-20 text-center md:border-l-2 border-white border-dashed bg-amber-600 rounded-md md:bg-transparent md:rounded-none"
            v-if="role === 'teacher'">
            <a href="/admin/_/" target="_blank">数据库管理</a>
          </NavigationMenuItem>
          <NavigationMenuItem
            class="py-1 px-3 min-w-20 text-center md:border-l-2 border-white border-dashed bg-amber-600 rounded-md md:bg-transparent md:rounded-none"
            v-if="role === 'teacher'">
            <RouterLink to="/review">志愿审核</RouterLink>
          </NavigationMenuItem>
          <NavigationMenuItem
            class="py-1 px-3 min-w-20 text-center md:border-l-2 border-white border-dashed bg-amber-600 rounded-md md:bg-transparent md:rounded-none">
            <RouterLink to="/about">关于此网站</RouterLink>
          </NavigationMenuItem>
          <NavigationMenuItem
            class="py-1 px-3 min-w-20 text-center md:border-l-2 border-white border-dashed bg-amber-600 rounded-md md:bg-transparent md:rounded-none">
            <button @click="clear_local_storage_cache">清除缓存</button>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </header>

    <p class="text-center p-2 bg-amber-300" v-if="reason || remainingEta">
      <span class="text-red-800 text-lg md:text-2xl font-semibold" v-if="reason === 'not-started'">选课时间还未到。<b>{{ eta }}</b> 后到达开始时间 {{ estimated
        }}，到时间后<b>无需</b>刷新页面。您可以<b>先在浏览器上对社团进行预览、选择</b>，开始后会自动出现“提交”按钮。</span>
      <span class="text-red-600 md:text-lg" v-else-if="reason === 'maintaining'">选课系统正在维护中，请耐心等待。</span>
      <span class="text-red-600 md:text-lg" v-else-if="reason === 'ended'">选课时间已结束。</span>
      <span v-else-if="remainingEta">选课系统即将维护，剩余时间 <b>{{ remainingEta }}</b> 秒。在维护开始后不保证能够收到选课请求。</span>
    </p>

    <div class="flex-grow">
      <RouterView v-slot="{ Component }">
        <Transition name="fade" mode="out-in">
          <component :is="Component"></component>
        </Transition>
      </RouterView>
    </div>

    <AlertDialog class="bg-red-200" :open="errorStore.errorWindowOpen">
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>错误</AlertDialogTitle>
        </AlertDialogHeader>
        <div v-for="message in errorStore.errorMessages" class="text-red-800">
          <div>{{ message }}</div>
        </div>
        <AlertDialogFooter>
          <AlertDialogAction @click="errorStore.clear_error()">确认并关闭</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>

    <footer class="p-4 text-center">
      <img src="/img/logo.png" width="323" class="inline-block">
    </footer>
  </div>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>