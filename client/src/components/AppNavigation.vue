<script setup lang="ts">
import { computed } from 'vue';
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
} from '@/components/ui/navigation-menu';
import { RouterLink } from 'vue-router';
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();

const name = computed(() => userStore.userInformation.name);
const role = computed(() => userStore.userInformation.role);
const loginNavText = computed(() => name.value ? `账号 (${name.value})` : '登录')

function clear_local_storage_cache() {
  localStorage.clear();
  location.reload();
}

interface NavItem {
  link: string;
  text: string | (() => string);
  bold?: boolean;
  roles: string[];
}

const navItems: NavItem[] = [
  { link: "/", text: () => loginNavText.value, roles: ["student", "teacher", ""] },
  { link: "/choose", text: "选课", bold: true, roles: ["student"] },
  { link: '/admin', text: "网站管理", roles: ["teacher"] },
  { link: "/dashboard", text: "数据总览", roles: ["teacher"] },
  { link: "/about", text: "关于此网站", roles: ["teacher", "student"] },
  { link: "#", text: "清除缓存", roles: ["teacher", "student", ""], bold: true },
];
</script>

<template>
  <header
    class="flex flex-col md:flex-row gap-2 justify-between items-center bg-gradient-to-r from-amber-700 to-amber-800 text-amber-50 p-4 shadow-lg">
    <div class="flex items-center">
      <h1
        class="border-2 border-amber-200 rounded-lg bg-gradient-to-r from-amber-50 to-amber-100 text-amber-800 font-bold px-4 py-2 text-xl md:text-2xl shadow-md">
        华二宝山社团选课系统
      </h1>
    </div>
    <NavigationMenu>
      <NavigationMenuList class="flex-wrap py-2 gap-1 md:gap-0">
        <NavigationMenuItem v-for="item in navItems" :key="item.link"
          class="py-1 px-3 mx-1 text-sm md:text-base text-center rounded-lg transition-all duration-200 hover:bg-amber-600 hover:text-white"
          :class="{
            'bg-amber-600/30': item.link !== '#',
            'bg-red-500/80 hover:bg-red-600': item.text === '清除缓存'
          }" v-show="item.roles.includes(role)">
          <RouterLink v-if="item.link !== '#'" :to="item.link" :class="{ 'font-bold': item.bold }"
            class="block w-full h-full">
            {{ typeof item.text === 'function' ? item.text() : item.text }}
          </RouterLink>
          <button v-else @click="clear_local_storage_cache" class="font-bold">
            {{ typeof item.text === 'function' ? item.text() : item.text }}
          </button>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  </header>
</template>
