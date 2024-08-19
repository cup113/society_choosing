<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router';
import { computed } from 'vue';

import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { Button } from '@/components/ui/button';

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
  <div class="flex flex-col min-h-screen gap-4 bg-[#fef8d8]">
    <header>
      <NavigationMenu class="mx-auto">
        <NavigationMenuList>
          <NavigationMenuItem :class="navigationMenuTriggerStyle()">
            <RouterLink to="/">{{ loginNavText }}</RouterLink>
          </NavigationMenuItem>
          <NavigationMenuItem :class="navigationMenuTriggerStyle()" v-if="role === 'student'">
            <RouterLink to="/choose" class="font-bold">选课</RouterLink>
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
      <Button @click="clear_local_storage_cache">清除缓存</Button>
    </footer>
  </div>
</template>

<style></style>