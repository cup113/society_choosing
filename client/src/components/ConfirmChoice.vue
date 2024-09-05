<script lang="ts" setup>
import { AlertDialog, AlertDialogFooter, AlertDialogContent, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog';

import ChoiceShow from './ChoiceShow.vue';

import { useSocietyStore } from '@/stores/society';
import { useUserStore } from '@/stores/user';
import { computed } from 'vue';

const societyStore = useSocietyStore();
const userStore = useUserStore();

const props = defineProps<{
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

const limits = computed(() => {
  return (['first_choice', 'second_choice', 'third_choice'] as const).map(key => {
    return societyStore.societies.find(society => society.name === props.choice[key])?.limit;
  }).filter(Boolean).join('、');
})
</script>

<template>
  <AlertDialog :open="open">
    <AlertDialogContent>
      <ChoiceShow :choice="choice">
        <template #title>选课确认</template>
        <template #content>是否确认选择以下课程：</template>
        <template #extra>
          <div v-if="societyStore.question">您对附加问题的回答是：<b>{{ userStore.answer }}</b></div>
          <div v-if="limits">请确认您满足以下限制：<b>{{ limits }}</b></div>
        </template>
      </ChoiceShow>
      <AlertDialogFooter>
        <AlertDialogCancel class="bg-red-500" @click="$emit('cancel-choice')">取消</AlertDialogCancel>
        <AlertDialogAction class="bg-green-500" @click="$emit('confirm-choice')">确认</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>
