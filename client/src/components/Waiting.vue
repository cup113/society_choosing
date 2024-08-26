<script lang="ts" setup>
import { ref, computed, watch } from 'vue';
import { useNow } from '@vueuse/core';

import { Dialog, DialogHeader, DialogDescription, DialogTitle, DialogContent } from '@/components/ui/dialog';

defineSlots<{
  default: () => any;
}>();

const props = defineProps<{
  show: boolean;
}>();

const start = ref(Date.now());
const now = useNow({
  interval: 30,
});
const time = computed(() => {
  return now.value.getTime() - start.value;
});

watch(computed(() => props.show), value => {
  if (value) {
    start.value = Date.now();
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
