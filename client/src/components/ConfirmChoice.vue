<script lang="ts" setup>
import { AlertDialog, AlertDialogFooter, AlertDialogContent, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog';

import ChoiceShow from './ChoiceShow.vue';

defineProps<{
  open: boolean,
  choice: {
    first_choice?: string,
    second_choice?: string,
    third_choice?: string,
  }
}>();

defineEmits<{
  (emit: 'confirm-choice'): void;
  (emit: 'cancel-choice'): void;
}>();
</script>

<template>
  <AlertDialog :open="open">
    <AlertDialogContent>
      <ChoiceShow :choice="choice">
        <template #title>选课确认</template>
        <template #content>是否确认选择以下课程：</template>
      </ChoiceShow>
      <AlertDialogFooter>
        <AlertDialogCancel class="bg-red-500" @click="$emit('cancel-choice')">取消</AlertDialogCancel>
        <AlertDialogAction class="bg-green-500" @click="$emit('confirm-choice')">确认</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>
