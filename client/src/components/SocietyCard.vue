<script lang="ts" setup>
import { computed } from 'vue';

const props = defineProps<{
  society: {
    id: string;
    name: string;
    cap: number;
  }
}>();

const society = computed(() => props.society);
</script>

<template>
  <div class="flex justify-between items-center border-2 border-slate-200 rounded-md shadow-md px-2 py-1 max-w-96 min-w-64">
    <span class="font-bold text-2xl">{{ society.name }}</span>
    <span>
      <span>限额: <b>{{ society.cap }}</b> 人</span>
    </span>
  </div>
</template>
