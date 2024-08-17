<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router';
import { computed } from 'vue';

import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'

import { useUserStore } from './stores/user';

const userStore = useUserStore();
const name = computed(() => userStore.userInformation.name);
const role = computed(() => userStore.userInformation.role);
</script>

<template>
  <div class="flex flex-col min-h-screen gap-4">
    <header>
      <NavigationMenu class="mx-auto">
        <NavigationMenuList>
          <NavigationMenuItem :class="navigationMenuTriggerStyle()">
            <RouterLink to="/">首页</RouterLink>
          </NavigationMenuItem>
          <NavigationMenuItem :class="navigationMenuTriggerStyle()" v-if="role === 'student'">
            <RouterLink to="/choose" class="font-bold">选课</RouterLink>
          </NavigationMenuItem>
          <NavigationMenuItem :class="navigationMenuTriggerStyle()">
            <RouterLink to="/login">
              <span v-if="userStore.userID.length === 0" class="font-bold">登录</span>
              <span v-else>管理账号 ({{ name }})</span>
            </RouterLink>
          </NavigationMenuItem>
          <NavigationMenuItem :class="navigationMenuTriggerStyle()" v-if="role === 'teacher'">
            <RouterLink to="/export">导出数据</RouterLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </header>

    <div class="flex-grow">
      <RouterView />
    </div>

    <footer class="bg-red-300">
      <div>华东师范大学第二附属中学（宝山校区）</div>
      <div>备案：<!--TODO--></div>
    </footer>
  </div>
</template>

<style></style>