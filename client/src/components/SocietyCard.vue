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
    </div>

    <hr class="my-3 border-amber-100">

    <div class="mb-3">
      <div v-if="society.limit"
        class="inline-flex bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-sm mb-2">
        <strong>限制：{{ society.limit }}</strong>
      </div>
      <div v-else
        class="inline-flex bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm mb-2">
        无选课限制
      </div>

      <div class="py-2 text-gray-700 text-sm leading-relaxed">
        {{ society.description }}
      </div>
    </div>

    <hr class="my-3 border-amber-100">

    <div class="flex justify-end gap-4 items-center">
      <div class="flex items-center gap-2 text-center bg-amber-100 rounded-lg px-3 py-1">
        <span class="text-sm text-amber-700">限额</span>
        <b class="text-amber-800 text-lg">{{ society.cap }}</b>
      </div>
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