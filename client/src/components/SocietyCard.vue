<script lang="ts" setup>
import { computed } from 'vue';
import type { Society } from '@/stores/society';

const props = defineProps<{
  society: Society
}>();

const society = computed(() => props.society);
</script>

<template>
  <div class="society-card border-2 border-slate-200 rounded-md shadow-md px-2 py-1 w-72">
    <div class="flex items-center gap-3 mb-2">
      <div class="text-gray-300 font-bold">{{ society.index }}</div>
      <div class="flex-grow flex flex-col">
        <div class="flex items-center justify-between gap-2 border-b border-gray-500 pb-1 border-dashed">
          <span class="font-bold text-2xl w-40">{{ society.name }}<span class="text-base absolute bg-red-600 rounded-full text-white px-2" v-if="society.isCoreMember">核心成员</span></span>
          <span class="text-gray w-16">限 <b>{{ society.cap }}</b> 人</span>
        </div>
        <div class="pt-2 flex justify-between items-center">
          <span class="text-gray-500" v-if="!society.limit">无限制</span>
          <span class="font-bold text-gray-700">{{ society.limit }}</span>
          <span class="text-sm text-gray-700 max-w-32">指导教师: {{ society.teacher }}</span>
        </div>
      </div>
    </div>
    <div class="flex justify-between items-center px-2 py-1 indent-8 border-t border-gray-500">{{ society.description }}
    </div>
  </div>
</template>
