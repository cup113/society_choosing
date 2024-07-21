<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router';

import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'

import { useUserStore } from './stores/user';

// TODO username, role

const userStore = useUserStore();
</script>

<template>
  <header class="my-2">
    <NavigationMenu class="mx-auto">
      <NavigationMenuList>
        <NavigationMenuItem :class="navigationMenuTriggerStyle()">
          <RouterLink to="/">首页</RouterLink>
        </NavigationMenuItem>
        <NavigationMenuItem :class="navigationMenuTriggerStyle()">
          <RouterLink to="/choose" class="font-bold">选课</RouterLink>
        </NavigationMenuItem>
        <NavigationMenuItem :class="navigationMenuTriggerStyle()">
          <RouterLink to="/login">
            <span v-if="userStore.userID.length === 0" class="font-bold">登录</span>
            <span v-else>管理账号 (ID: {{ userStore.userID }})</span>
          </RouterLink>
        </NavigationMenuItem>
        <NavigationMenuItem :class="navigationMenuTriggerStyle()">
          <RouterLink to="/export">导出数据</RouterLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  </header>

  <RouterView />
</template>

<style></style>