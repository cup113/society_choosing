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
  <Collapsible class="society-card border-2 border-slate-200 rounded-md shadow-md px-2 py-1 w-72">
    <div class="flex items-center gap-3 mb-2">
      <div class="text-gray-300 font-bold">{{ society.index }}</div>
      <div class="flex-grow flex flex-col">
        <div class="flex items-center justify-between gap-2 border-b border-gray-500 pb-1 border-dashed">
          <span class="font-bold text-2xl w-40">{{ society.name }}</span>
          <span class="text-gray w-16">限 <b>{{ society.cap }}</b> 人</span>
        </div>
        <div class="pt-2 flex justify-between items-center">
          <span class="text-gray-500" v-if="!society.limit">无限制</span>
          <span class="font-bold text-gray-700">{{ society.limit }}</span>
          <CollapsibleTrigger as-child>
            <Button size="sm" variant="outline" class="bg-[#cd8749] hover:bg-[#bd7739] text-white px-1 py-0 h-7">
              查看简介
              <ChevronsUpDown class="w-4 h-4" />
            </Button>
          </CollapsibleTrigger>
        </div>
      </div>
    </div>
    <CollapsibleContent>
      <div class="flex justify-between items-center px-2 py-1 indent-8 border-t border-gray-500">{{ society.description }}。</div>
    </CollapsibleContent>
  </Collapsible>
</template>
