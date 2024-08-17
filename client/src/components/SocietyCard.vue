<script lang="ts" setup>
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

import { useUserStore } from '@/stores/user';
import { computed } from 'vue';

const props = defineProps<{
  society: {
    id: string;
    name: string;
    cap: number;
  }
}>();

const store = useUserStore();

const society = computed(() => props.society);

if (store.choice[society.value.id] === undefined) {
  store.choice[society.value.id] = 'default';
}
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>{{ society.name }}</CardTitle>
      <CardDescription class="text-lg">上限人数：<b>{{ society.cap }}</b></CardDescription>
    </CardHeader>
    <CardContent>
      <!--TODO 社团介绍-->
    </CardContent>
    <CardFooter>
      <Select v-model="store.choice[society.id]">
        <SelectTrigger>
          <SelectValue placeholder="选择为..."></SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="first_choice">第一志愿</SelectItem>
          <SelectItem value="second_choice">第二志愿</SelectItem>
          <SelectItem value="adjust_prior">优先调剂</SelectItem>
          <SelectItem value="default">不选择</SelectItem>
        </SelectContent>
      </Select>
    </CardFooter>
  </Card>
</template>
