<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useSocietyStore } from '@/stores/society';
import { useTimeStore } from '@/stores/time';
import { Card, CardContent } from '@/components/ui/card';

const societyStore = useSocietyStore();
const timeStore = useTimeStore();

const estimated = computed(() => societyStore.timeStatus?.open === false && societyStore.timeStatus.reason === 'not-started' ? societyStore.timeStatus.estimated.format("MM月DD日 HH:mm:ss") : undefined);

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
  <Card class="mt-4 md:mx-4 bg-gradient-to-r from-amber-100 to-amber-200 border-amber-300 shadow-md" v-if="reason">
    <CardContent>
      <div class="text-center text-amber-900" v-if="reason === 'not-started'">
        <div class="flex items-center justify-center gap-2 mb-2">
          <div class="w-3 h-3 rounded-full bg-amber-500 animate-pulse"></div>
          <span class="font-bold text-lg md:text-xl">选课尚未开始</span>
        </div>
        <p class="mb-2">
          距离选课开始还有 <span class="font-bold text-amber-800">{{ eta }}</span>
          <br>预计开始时间（本机）: <span class="bg-amber-300/50 px-2 py-1 rounded">{{ estimated }}</span>
        </p>
        <p class="text-sm italic font-bold">
          您可以先在浏览器上预览和选择社团，开始后会自动显示"提交"按钮，无需刷新
        </p>
      </div>
      <div class="text-center text-amber-900" v-else-if="reason === 'no-activity'">
        <div class="flex items-center justify-center gap-2 mb-2">
          <div class="w-3 h-3 rounded-full bg-amber-500"></div>
          <span class="font-bold text-lg md:text-xl">暂无选课活动</span>
        </div>
        <p>管理员尚未设置当前选课活动</p>
        <p class="text-sm mt-1">若您被通知即将选课，请联系管理员</p>
      </div>
      <div class="text-center text-red-600" v-else-if="reason === 'ended'">
        <div class="flex items-center justify-center gap-2 mb-2">
          <div class="w-3 h-3 rounded-full bg-red-500"></div>
          <span class="font-bold text-lg md:text-xl">选课已结束</span>
        </div>
        <p>选课时间已经结束，如有疑问请联系管理员</p>
      </div>
    </CardContent>
  </Card>
</template>