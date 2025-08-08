<script setup lang="ts">
import { RouterView } from 'vue-router';
import AppNavigation from '@/components/AppNavigation.vue';
import AlertTimeStatus from '@/components/AlertTimeStatus.vue';
import AlertCoreMember from '@/components/AlertCoreMember.vue';
import AlertError from '@/components/AlertError.vue';
import { RefreshCcwIcon } from 'lucide-vue-next'

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

    <footer
      class="mt-8 border-t border-amber-200 dark:border-stone-700 bg-gradient-to-r from-amber-50/50 to-stone-100/50 dark:from-stone-800/50 dark:to-stone-900/50">
      <div class="container mx-auto px-4 py-6">
        <div class="flex flex-col items-center justify-center">
          <img src="/img/logo.png" width="240" class="inline-block opacity-80 mb-4">
          <p class="text-stone-600 dark:text-stone-300 text-sm">
            华二宝山社团选课系统 © 2025
          </p>
          <button @click="clear_local_storage_cache"
            class="text-stone-500 dark:text-stone-400 text-xs mt-2 hover:text-stone-700 dark:hover:text-stone-300 transition-colors flex items-center gap-1"
            aria-label="清除浏览器缓存并刷新页面">
            <RefreshCcwIcon class="w-4 h-4"></RefreshCcwIcon>
            清除缓存
          </button>
        </div>
      </div>
    </footer>
  </div>
</template>
