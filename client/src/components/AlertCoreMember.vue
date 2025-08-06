<script setup lang="ts">
import { useSocietyStore } from '@/stores/society';

const societyStore = useSocietyStore();
</script>

<template>
  <p class="text-center p-2 bg-amber-300" v-if="societyStore.coreMemberOf">
    您已被 <b class="text-amber-800">{{ societyStore.coreMemberOf }}</b> 预定为核心成员，无需进行选课。
  </p>
</template>
