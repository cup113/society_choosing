<script setup lang="ts">
import SocietyCard from '@/components/SocietyCard.vue';

defineProps<{
    title?: string;
    societies: any[];
}>();
</script>

<template>
    <section class="w-full max-w-7xl mx-auto px-4">
        <h2 v-if="title" class="font-bold text-center text-2xl mb-6 text-amber-800">{{ title }}</h2>
        <div v-if="societies.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <SocietyCard v-for="society in societies" :key="society.id" :society="society"
                class="hover-card mx-auto" />
        </div>
        <div v-else class="text-center py-12 bg-amber-50 rounded-xl border-2 border-amber-200 shadow-card">
            <p class="text-amber-700 text-lg">暂无社团信息</p>
        </div>
    </section>
</template>
