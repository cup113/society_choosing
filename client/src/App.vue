<script setup lang="ts">
import { RouterView } from 'vue-router';
import AppNavigation from '@/components/AppNavigation.vue';
import AlertTimeStatus from '@/components/AlertTimeStatus.vue';
import AlertCoreMember from '@/components/AlertCoreMember.vue';
import AlertError from '@/components/AlertError.vue';

function clear_local_storage_cache() {
  localStorage.clear();
  location.reload();
}
</script>

<template>
  <div class="flex flex-col min-h-screen bg-amber-50 dark:bg-stone-900 dark:text-white">
    <AppNavigation />
    <AlertTimeStatus />
    <AlertCoreMember />
    <div class="flex-grow">
      <RouterView v-slot="{ Component }">
        <Transition name="fade" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </div>
    <AlertError />

    <footer class="p-6 text-center bg-gradient-to-r from-amber-700/10 to-stone-800/10 mt-8">
      <img src="/img/logo.png" width="320" class="inline-block opacity-80">
      <p class="text-stone-600 dark:text-stone-300 text-sm mt-2">
        华二宝山社团选课系统 © {{ new Date().getFullYear() }}
      </p>
      <button @click="clear_local_storage_cache" class="text-stone-500 dark:text-stone-400 text-xs mt-2 hover:text-stone-700 dark:hover:text-stone-300 transition-colors">
        清除缓存
      </button>
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
