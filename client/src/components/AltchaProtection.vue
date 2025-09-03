<script lang="ts" setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import 'altcha';
import 'altcha/i18n/zh-cn';

const altchaWidget = ref<HTMLElement | null>(null);
const props = defineProps<{
  payload?: string;
}>();
const emit = defineEmits<{
  (e: 'update:payload', value: string): void;
}>();

const internalValue = ref(props.payload);

watch(internalValue, (v) => {
  emit('update:payload', v || '');
});

const onStateChange = (ev: CustomEvent | Event) => {
  if ('detail' in ev) {
    const { payload, state } = ev.detail;
    if (state === 'verified' && payload) {
      internalValue.value = payload;
    } else {
      internalValue.value = '';
    }
  }
};

onMounted(() => {
  if (altchaWidget.value) {
    altchaWidget.value.addEventListener('statechange', onStateChange);
  }
});

onUnmounted(() => {
  if (altchaWidget.value) {
    altchaWidget.value.removeEventListener('statechange', onStateChange);
  }
});
</script>

<template>
  <altcha-widget ref="altchaWidget" style="--altcha-max-width: 100%;" challengeurl="/api/altcha/get">
  </altcha-widget>
</template>
