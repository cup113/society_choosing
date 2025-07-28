<script lang="ts" setup>
import { computed } from 'vue';
import type { Society } from '@/stores/society';
import { Button } from '@/components/ui/button';
import { useUserStore } from '@/stores/user';

const props = defineProps<{
  society: Society
}>();
const userStore = useUserStore();

const society = computed(() => props.society);
const heatHint = computed(() => {
  if (!society.value.lastYearBatch || !society.value.lastYearSeconds) {
    return '';
  }
  const batch = ['第一志愿', '第二志愿', '第三志愿'][society.value.lastYearBatch - 1];
  const sec = society.value.lastYearSeconds;
  const time = sec < 10 ? (sec.toFixed(2) + "s") : (sec < 300 ? (sec.toFixed(0) + "s") : (sec < 6000 ? (sec / 60).toFixed(0) + "min" : ((sec / 3600).toFixed(0) + "h")));
  if (society.value.lastYearBatch === 1) {
    return `去年录取至：<b class="text-yellow-700">${batch} ${time}</b>`;
  } else {
    return `去年录取至：<span class="text-amber-800">${batch}</span> ${time}`;
  }
});
const isFavorite = computed(() => userStore.favorites.includes(society.value.id));
const toggle_favorite = () => {
  if (isFavorite.value) {
    userStore.favorites.splice(userStore.favorites.indexOf(society.value.id), 1)
    console.log(userStore.favorites);
  } else {
    userStore.favorites.push(society.value.id);
    console.log(userStore.favorites);
  }
}
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
    <div class="flex justify-between items-center">
      <div class="text-sm text-slate-500" v-html="heatHint"></div>
      <Button @click="toggle_favorite" variant="outline" class="h-8 w-10" :class="{ 'bg-red-200': isFavorite, 'hover:bg-red-300': isFavorite }">收藏</Button>
    </div>
  </div>
</template>
