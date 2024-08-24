<script lang="ts" setup>
import { ref, computed, watch } from 'vue';

import { Dialog, DialogHeader, DialogDescription, DialogTitle, DialogContent } from '@/components/ui/dialog';

defineSlots<{
  default: () => any;
}>();

const props = defineProps<{
  show: boolean;
}>();

const start = ref(Date.now());
const now = ref(Date.now());
const time = computed(() => {
  return now.value - start.value;
});
let handle = null as number | null;

watch(computed(() => props.show), value => {
  if (value) {
    start.value = Date.now();
    handle = setInterval(() => {
      now.value = Date.now();
    }, 50);
  } else {
    if (handle) {
      clearInterval(handle);
    }
  }
}, { immediate: true });

</script>

<template>
  <div>
    <Dialog :open="show">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>正在加载中...</DialogTitle>
          <DialogDescription>请稍候...</DialogDescription>
        </DialogHeader>
        <slot name="default"></slot>
        <p>已消耗时间: {{ time }}ms</p>
      </DialogContent>
    </Dialog>
  </div>
</template>
