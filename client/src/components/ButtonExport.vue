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
            class="gradient-amber-btn font-bold py-3 px-6 rounded-xl shadow-lg hover-lift flex items-center gap-2">
            <DownloadIcon class="w-5 h-5" />
            导出 {{ filename }}
        </Button>
    </div>
</template>
