<script lang="ts" setup>
import { computed } from 'vue';
import { ChevronsUpDown } from 'lucide-vue-next';

import { Button } from './ui/button';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';
import type { Society } from '@/stores/society';

const props = defineProps<{
  society: Society
}>();

const society = computed(() => props.society);
</script>

<template>
  <Collapsible
    class="society-card border-2 border-slate-200 rounded-md shadow-md px-2 py-1 max-w-96 min-w-64">
    <div class="flex items-center justify-between gap-2">
      <span class="text-gray-300 font-bold text-sm">{{ society.index }}</span>
      <span class="font-bold text-2xl w-32">{{ society.name }}</span>
      <span class="text-gray w-16">限 <b>{{ society.cap }}</b> 人</span>
      <CollapsibleTrigger as-child>
        <Button size="sm" variant="outline" class="bg-[#cd8749] hover:bg-[#bd7739] text-white p-1">
          <ChevronsUpDown class="w-4 h-4" />
        </Button>
      </CollapsibleTrigger>
    </div>
    <CollapsibleContent>
      <div class="flex justify-between items-center">社团介绍（暂无）</div>
    </CollapsibleContent>
  </Collapsible>
</template>
