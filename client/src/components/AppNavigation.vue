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
  { link: "#", text: "清除缓存", roles: ["teacher", "student", ""] },
];
</script>

<template>
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
</template>
