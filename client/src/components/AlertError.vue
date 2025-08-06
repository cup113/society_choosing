<script setup lang="ts">
import { useErrorStore } from '@/stores/error';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogAction
} from '@/components/ui/alert-dialog';

const errorStore = useErrorStore();
</script>

<template>
  <AlertDialog class="bg-red-200" :open="errorStore.errorWindowOpen">
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>错误</AlertDialogTitle>
      </AlertDialogHeader>
      <div v-for="message in errorStore.errorMessages" class="text-red-800">
        <div>{{ message }}</div>
      </div>
      <AlertDialogFooter>
        <AlertDialogAction @click="errorStore.clear_error()">确认并关闭</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>
