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

interface NavItem {
  link: string;
  text: string | (() => string);
  bold?: boolean;
  roles: string[];
}

const navItems: NavItem[] = [
  { link: "/", text: () => loginNavText.value, roles: ["student", "teacher", ""] },
  { link: "/choose", text: "选课", bold: true, roles: ["student"] },
  { link: '/admin/users', text: "网站管理", roles: ["teacher"] },
  { link: "/dashboard", text: "数据总览", roles: ["teacher"] },
  { link: "/about", text: "关于此网站", roles: ["teacher", "student"] },
];
</script>

<template>
  <header
    class="flex flex-col md:flex-row gap-2 justify-between items-center navbar-gradient p-4 shadow-lg">
    <div class="flex items-center">
      <h1
        class="border-2 border-amber-200 rounded-lg gradient-amber-title font-bold px-4 py-2 text-xl md:text-2xl shadow-md">
        华二宝山社团选课系统
      </h1>
    </div>
    <NavigationMenu>
      <NavigationMenuList class="flex-wrap py-2 gap-1 md:gap-0">
        <NavigationMenuItem v-for="item in navItems" :key="item.link"
          class="py-1 px-3 mx-1 text-sm md:text-base text-center rounded-lg transition-all duration-200 hover:bg-amber-600 hover:text-white bg-amber-600/30"
          v-show="item.roles.includes(role)">
          <RouterLink :to="item.link" :class="{ 'font-bold': item.bold }"
            class="block w-full h-full">
            {{ typeof item.text === 'function' ? item.text() : item.text }}
          </RouterLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  </header>
</template>
