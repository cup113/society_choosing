<script lang="ts" setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import 'altcha';
import 'altcha/i18n/zh-cn';

interface AltchaWidgetElement extends HTMLElement {
  reset(): void;
}

const altchaWidget = ref<AltchaWidgetElement | null>(null);
const props = defineProps<{
  payload?: string;
  needRefreshTime?: string;
}>();
const emit = defineEmits<{
  (e: 'update:payload', value: string): void;
}>();

const internalValue = ref(props.payload);

watch(internalValue, (v) => {
  emit('update:payload', v || '');
});

watch(() => props.needRefreshTime, v => {
  if (v !== undefined) {
    if (altchaWidget.value !== null) {
      altchaWidget.value.reset();
    }
  }
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
