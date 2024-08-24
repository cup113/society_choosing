<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router';
import { computed } from 'vue';

import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
} from '@/components/ui/navigation-menu';

import { useUserStore } from './stores/user';

const userStore = useUserStore();
const name = computed(() => userStore.userInformation.name);
const role = computed(() => userStore.userInformation.role);
const loginNavText = computed(() => name.value ? `账号 (${name.value})` : '登录')

function clear_local_storage_cache() {
  localStorage.clear();
  location.reload();
}
</script>

<template>
  <div class="flex flex-col min-h-screen gap-4">
    <header class="flex flex-col md:flex-row gap-2 justify-between items-center bg-amber-700 text-amber-700 pl-2">
      <h1 class="border text-2xl border-gray-300 rounded-md bg-white font-bold px-4 py-2">华二宝山选课系统</h1>
      <NavigationMenu>
        <NavigationMenuList class="flex-wrap py-4 gap-2 md:gap-0 text-white">
          <NavigationMenuItem class="py-1 px-3 min-w-20 text-center md:border-l-2 border-white border-dashed bg-amber-600 rounded-md md:bg-transparent md:rounded-none">
            <RouterLink to="/">{{ loginNavText }}</RouterLink>
          </NavigationMenuItem>
          <NavigationMenuItem class="py-1 px-3 min-w-20 text-center md:border-l-2 border-white border-dashed bg-amber-600 rounded-md md:bg-transparent md:rounded-none" v-if="role === 'student'">
            <RouterLink to="/choose" class="font-bold">选课</RouterLink>
          </NavigationMenuItem>
          <NavigationMenuItem class="py-1 px-3 min-w-20 text-center md:border-l-2 border-white border-dashed bg-amber-600 rounded-md md:bg-transparent md:rounded-none" v-if="role === 'teacher'">
            <RouterLink to="/export">导出数据</RouterLink>
          </NavigationMenuItem>
          <NavigationMenuItem class="py-1 px-3 min-w-20 text-center md:border-l-2 border-white border-dashed bg-amber-600 rounded-md md:bg-transparent md:rounded-none">
            <RouterLink to="/about">关于此网站</RouterLink>
          </NavigationMenuItem>
          <NavigationMenuItem class="py-1 px-3 min-w-20 text-center md:border-l-2 border-white border-dashed bg-amber-600 rounded-md md:bg-transparent md:rounded-none">
            <button @click="clear_local_storage_cache">清除缓存</button>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </header>

    <div class="flex-grow">
      <RouterView v-slot="{ Component }">
        <Transition name="fade" mode="out-in">
          <component :is="Component"></component>
        </Transition>
      </RouterView>
    </div>

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