<script setup lang="ts">
import { computed } from 'vue';
import { useSocietyStore } from '@/stores/society';
import ChoiceShow from '@/components/ChoiceShow.vue';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const props = defineProps<{
  choice: any
}>();

const societyStore = useSocietyStore();

const choices = computed(() => {
  return props.choice?.choices.map((id: string) => societyStore.get_society(id)?.name ?? "未知") ?? ["", "", ""];
});
</script>

<template>
  <Card class="w-full max-w-md border-2 border-green-200 shadow-md bg-gradient-to-br from-green-50 to-white">
    <CardHeader>
      <CardTitle class="flex items-center gap-2 text-green-800">
        <div class="w-3 h-3 rounded-full bg-green-500"></div>
        <span>选课记录</span>
      </CardTitle>
    </CardHeader>
    <CardContent>
      <ChoiceShow :choice="choices">
        <template #title>选课信息</template>
        <template #description>
          <div class="flex flex-col px-1 item-center text-sm text-gray-600">
            <span>提交时间: {{ choice.updated.format("MM-DD HH:mm:ss.SSS") }}</span>
            <span v-if="choice.ip">
              <span v-if="choice.ip === societyStore.localIP" class="text-green-600 font-medium">请求来自本机</span>
              <span v-else class="text-amber-600">请求来自 IP {{ choice.ip }}</span>
            </span>
          </div>
        </template>
      </ChoiceShow>
    </CardContent>
  </Card>
</template>
