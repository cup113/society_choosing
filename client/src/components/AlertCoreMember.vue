<script setup lang="ts">
import { useSocietyStore } from '@/stores/society';
import { Card, CardContent } from '@/components/ui/card';

const societyStore = useSocietyStore();
</script>

<template>
  <Card class="mt-4 md:mx-4 bg-gradient-to-r from-green-100 to-emerald-100 border-green-300 shadow-card" v-if="societyStore.coreMemberOf">
    <CardContent class="text-center">
      <div class="flex items-center justify-center gap-2 mb-1">
        <div class="w-3 h-3 rounded-full bg-green-500"></div>
        <span class="font-bold text-green-800">核心成员通知</span>
      </div>
      <p class="text-green-900">
        您已被 <span class="font-bold">{{ societyStore.coreMemberOf }}</span> 预定为核心成员，无需进行选课。
      </p>
    </CardContent>
  </Card>
</template>
