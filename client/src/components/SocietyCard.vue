<script lang="ts" setup>
import { computed } from 'vue';
import type { Society } from '@/stores/society';
import { Button } from '@/components/ui/button';
import { useUserStore } from '@/stores/user';
import { HeartIcon, HeartOffIcon, CheckIcon, AlertTriangleIcon, UserIcon } from 'lucide-vue-next';

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
    return `去年录取至：<b class="text-amber-700">${batch} ${time}</b>`;
  } else {
    return `去年录取至：<span class="text-amber-800">${batch}</span> ${time}`;
  }
});
const isFavorite = computed(() => userStore.favorites.includes(society.value.id));
const toggle_favorite = () => {
  if (isFavorite.value) {
    userStore.favorites.splice(userStore.favorites.indexOf(society.value.id), 1)
  } else {
    userStore.favorites.push(society.value.id);
  }
}
</script>

<template>
  <div
    class="society-card border-2 border-amber-200 rounded-xl shadow-lg px-5 py-4 w-full max-w-sm bg-white hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
    <div class="flex items-start justify-between">
      <div>
        <div class="flex items-center gap-2 mb-2">
          <span class="text-xl font-bold text-amber-800">{{ society.name }}</span>
          <span class="text-amber-400 font-bold text-sm">#{{ society.index }}</span>
        </div>
        <div class="text-sm text-gray-600 flex items-center gap-1">
          <UserIcon class="w-4 h-4" />
          指导教师：{{ society.teacher }}
        </div>
      </div>
      <div class="text-center bg-amber-100 rounded-lg px-3 py-1">
        <span class="text-xs text-amber-700 block">限额</span>
        <b class="text-amber-800 text-xl">{{ society.cap }}</b>
      </div>
    </div>

    <hr class="my-3 border-amber-100">

    <div class="mb-3">
      <div v-if="society.limit"
        class="inline-flex items-center gap-1 bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-xs font-medium mb-2">
        <AlertTriangleIcon class="w-3 h-3" />
        限制：{{ society.limit }}
      </div>
      <div v-else
        class="inline-flex items-center gap-1 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium mb-2">
        <CheckIcon class="w-3 h-3" />
        无选课限制
      </div>

      <div class="py-2 text-gray-700 text-sm leading-relaxed">
        {{ society.description }}
      </div>
    </div>

    <hr class="my-3 border-amber-100">

    <div class="flex justify-between items-center">
      <div class="text-sm text-gray-500 min-h-[20px]" v-html="heatHint"></div>
      <Button @click="toggle_favorite" variant="outline" size="sm"
        class="h-9 w-9 p-0 border-2 transition-all duration-300" :class="{
          'bg-red-100 border-red-300 hover:bg-red-200 text-red-600': isFavorite,
          'border-amber-300 hover:bg-amber-100 text-amber-600': !isFavorite
        }">
        <HeartIcon v-if="isFavorite" class="w-4 h-4 fill-current" />
        <HeartOffIcon v-else class="w-4 h-4" />
      </Button>
    </div>
  </div>
</template>

<style scoped>
.society-card {
  backdrop-filter: blur(10px);
}
</style>