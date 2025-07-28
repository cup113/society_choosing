<script lang="ts" setup>
import { computed } from 'vue';
import type { Society } from '@/stores/society';
import { Button } from '@/components/ui/button';

const props = defineProps<{
  society: Society
}>();

const society = computed(() => props.society);
</script>

<template>
  <div class="society-card border-2 border-slate-200 rounded-md shadow-md px-4 py-2 w-72">
    <div class="flex items-center justify-between">
      <div>
        <div class="flex items-center justify-center my-1">
          <div class="flex gap-2 items-center">
            <span class="text-2xl font-bold">{{ society.name }}</span>
            <span class="text-slate-300 font-bold">#{{ society.index }}</span>
          </div>
        </div>
        <div class="text-sm text-slate-500">指导教师：{{ society.teacher }}</div>
      </div>
      <div class="text-center text-slate-700 w-16">
        <span class="text-sm">限额</span><br>
        <b class="text-amber-800 text-lg">{{ society.cap }}</b>
      </div>
    </div>
    <hr class="my-2">
    <div v-if="society.limit" class="font-bold text-amber-800">限制：{{ society.limit }}</div>
    <div v-else class="text-slate-500">无选课限制</div>
    <div class="py-1 text-sm">{{ society.description }}</div>
    <hr class="my-2">
    <div class="grid grid-cols-2 gap-x-4 gap-y-2">
      <Button class="px-1 h-8 bg-yellow-500 hover:bg-yellow-600">⭐ 很感兴趣</Button>
      <Button class="px-1 h-8 bg-amber-500 hover:bg-amber-600">😀 感兴趣</Button>
      <Button class="px-1 h-8 bg-blue-500 hover:bg-blue-600">🤔 一般</Button>
      <Button class="px-1 h-8 bg-red-500 hover:bg-red-600">❌ 不考虑</Button>
    </div>
  </div>
</template>
