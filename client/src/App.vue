<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router';
import { computed, watch, ref } from 'vue';

import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
} from '@/components/ui/navigation-menu';

import { AlertDialog, AlertDialogHeader, AlertDialogTitle, AlertDialogContent, AlertDialogFooter, AlertDialogAction } from '@/components/ui/alert-dialog';

import { useUserStore } from './stores/user';
import { useSocietyStore } from './stores/society';
import { useErrorStore } from './stores/error';
import { useTimeStore } from './stores/time';
import { useNow } from '@vueuse/core';

const userStore = useUserStore();
const societyStore = useSocietyStore();
const errorStore = useErrorStore();
const timeStore = useTimeStore();

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

const eta = ref("");
watch(() => timeStore.now, () => {
  if (societyStore.timeStatus?.open !== false || societyStore.timeStatus.reason !== 'not-started') {
    return;
  }
  const ms = societyStore.timeStatus.estimated.diff(now.value.getTime());
  if (ms <= 0) {
    societyStore.timeStatus = { open: true, estimatedEnd: societyStore.timeStatus.estimated };
    return;
  }
  eta.value = timeStore.formatDuration(ms);
});

interface NavItem {
  link: string;
  text: string | (() => string);
  bold?: boolean;
  roles: string[];
}

const navItems: NavItem[] = [
  { link: "/", text: () => loginNavText.value, roles: ["student", "teacher"] },
  { link: "/choose", text: "选课", bold: true, roles: ["student"] },
  { link: "/dashboard", text: "数据总览", roles: ["teacher"] },
  { link: "/about", text: "关于此网站", roles: ["teacher", "student"] },
  { link: "#", text: "清除缓存", roles: ["teacher", "student"] },
];
</script>

<template>
  <div class="flex flex-col min-h-screen bg-amber-50 dark:bg-stone-900 dark:text-white">
    <header class="flex flex-col md:flex-row gap-2 justify-between items-center bg-amber-700 text-amber-700 pl-2">
      <h1 class="border text-2xl border-gray-300 rounded-md bg-white font-bold px-4 py-2">华二宝山社团选课系统</h1>
      <NavigationMenu>
        <NavigationMenuList class="flex-wrap py-4 gap-2 md:gap-0 text-white">
          <NavigationMenuItem v-for="item in navItems" :key="item.link"
            class="py-1 px-3 min-w-20 text-center md:border-l-2 border-white border-dashed bg-amber-600 rounded-md md:bg-transparent md:rounded-none"
            v-show="item.roles.includes(role)">
            <RouterLink v-if="item.link !== '#'" :to="item.link" :class="{ 'font-bold': item.bold }">
              {{ typeof item.text === 'function' ? item.text() : item.text }}
            </RouterLink>
            <button v-else @click="clear_local_storage_cache">
              {{ typeof item.text === 'function' ? item.text() : item.text }}
            </button>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </header>

    <p class="text-center p-2 bg-amber-300" v-if="reason || remainingEta">
      <span class="text-lg md:text-2xl text-amber-900 [&>b]:text-amber-800" v-if="reason === 'not-started'">
        <span>选课时间还未到。</span><b>{{ eta }}&nbsp;</b><span>后到达开始时间 {{ estimated }}，到时间后</span>
        <b>无需</b><span>刷新页面。</span>
        <br>
        <span>您可以</span><b>先在浏览器上对社团进行预览、选择</b><span>，开始后会自动出现“提交”按钮。</span>
      </span>
      <span class="text-red-600 md:text-lg" v-else-if="reason === 'ended'">选课时间已结束。</span>
    </p>

    <p class="text-center p-2 bg-amber-300" v-if="societyStore.coreMemberOf">
      您已被 <b class="text-amber-800">{{ societyStore.coreMemberOf }}</b> 预定为核心成员，无需进行选课。
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
