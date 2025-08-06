<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useSocietyStore } from '@/stores/society';
import { useTimeStore } from '@/stores/time';

const societyStore = useSocietyStore();
const timeStore = useTimeStore();

const estimated = computed(() => societyStore.timeStatus?.open === false && societyStore.timeStatus.reason === 'not-started' ? societyStore.timeStatus.estimated.format("MM-DD HH:mm:ss") : undefined);

const reason = computed(() => societyStore.timeStatus && !societyStore.timeStatus.open ? societyStore.timeStatus.reason : undefined);

const eta = ref("");
watch(() => timeStore.now, () => {
  if (societyStore.timeStatus?.open !== false || societyStore.timeStatus.reason !== 'not-started') {
    return;
  }
  const ms = societyStore.timeStatus.estimated.diff(timeStore.now.getTime());
  if (ms <= 0) {
    societyStore.timeStatus = { open: true, estimatedEnd: societyStore.timeStatus.estimated };
    return;
  }
  eta.value = timeStore.formatDuration(ms);
});
</script>

<template>
  <p class="text-center p-2 bg-amber-300" v-if="reason">
    <span class="text-lg md:text-2xl text-amber-900 [&>b]:text-amber-800" v-if="reason === 'not-started'">
      <span>选课时间还未到。</span><b>{{ eta }}&nbsp;</b><span>后到达开始时间 {{ estimated }}，到时间后</span>
      <b>无需</b><span>刷新页面。</span>
      <br>
      <span>您可以</span><b>先在浏览器上对社团进行预览、选择</b><span>，开始后会自动出现"提交"按钮。</span>
    </span>
    <span v-else-if="reason === 'no-activity'">管理员没有设置当前选课活动。若您被通知在接下来的几天内即将进入选课，请联系管理员。</span>
    <span class="text-red-600 md:text-lg" v-else-if="reason === 'ended'">选课时间已结束。</span>
  </p>
</template>
