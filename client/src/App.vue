<script setup lang="ts">
import { RouterView } from 'vue-router';
import AppNavigation from '@/components/AppNavigation.vue';
import AlertTimeStatus from '@/components/AlertTimeStatus.vue';
import AlertCoreMember from '@/components/AlertCoreMember.vue';
import AlertError from '@/components/AlertError.vue';
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
