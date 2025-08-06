<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { DownloadIcon } from 'lucide-vue-next';

defineProps<{
    onClick: () => void;
    filename: string;
}>();
</script>

<template>
    <div class="text-center">
        <Button @click="onClick"
            class="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-2">
            <DownloadIcon class="w-5 h-5" />
            导出 {{ filename }}
        </Button>
    </div>
</template>
