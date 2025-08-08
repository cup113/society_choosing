<script setup lang="ts">
import { useErrorStore } from '@/stores/error';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogDescription
} from '@/components/ui/alert-dialog';
import { AlertTriangleIcon } from 'lucide-vue-next';

const errorStore = useErrorStore();
</script>

<template>
  <AlertDialog :open="errorStore.errorWindowOpen">
    <AlertDialogContent class="max-w-md bg-white rounded-xl shadow-xl">
      <AlertDialogHeader>
        <div class="flex items-center gap-2 mb-2">
          <AlertTriangleIcon class="text-red-500 w-6 h-6" />
          <AlertDialogTitle class="text-red-700">发生错误</AlertDialogTitle>
        </div>
        <AlertDialogDescription class="sr-only">
          显示系统错误信息
        </AlertDialogDescription>
      </AlertDialogHeader>
      <div class="py-2">
        <div v-for="(message, index) in errorStore.errorMessages" :key="index"
          class="flex items-start gap-2 p-3 mb-2 last:mb-0 bg-red-50 rounded border border-red-200">
          <AlertTriangleIcon class="text-red-500 mt-0.5 flex-shrink-0 w-5 h-5" />
          <div class="text-red-800 text-sm">{{ message }}</div>
        </div>
      </div>
      <AlertDialogFooter>
        <AlertDialogAction @click="errorStore.clear_error()"
          class="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-colors">
          确认并关闭
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>
