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
let handle = null as ReturnType<typeof setInterval> | null;

watch(computed(() => props.show), value => {
  if (value) {
    start.value = Date.now();
    now.value = start.value;
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
          <DialogDescription><slot name="default"></slot></DialogDescription>
        </DialogHeader>
        <p>已等待: {{ time }}ms</p>
      </DialogContent>
    </Dialog>
  </div>
</template>
