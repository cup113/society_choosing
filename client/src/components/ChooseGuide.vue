<script setup lang="ts">
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
</script>

<template>
  <Accordion
    class="w-full max-w-4xl mx-auto border-2 border-amber-300 rounded-xl shadow-card bg-gradient-to-br from-amber-50 to-white"
    default-value="guide" type="single" :collapsible="true">
    <AccordionItem value="guide" class="border-0">
      <AccordionTrigger class="px-6 py-4 hover:bg-amber-100 rounded-t-xl">
        <h2 class="text-center w-full font-bold text-xl text-amber-800">选课指引</h2>
      </AccordionTrigger>
      <AccordionContent class="px-6 pb-6 pt-4">
        <div class="space-y-3 text-gray-700">
          <ol class="list-decimal pl-5 space-y-2">
            <li>您可以先浏览每个社团及其介绍，在感兴趣的社团右下角点击收藏图标以便最终填报选择。</li>
            <li>填报时，确保您满足社团的限制（若有），<strong class="text-amber-700">兴趣优先</strong>。</li>
            <li>录取时，<strong class="text-amber-700">志愿优先，同一志愿先到先得。</strong>部分社团可能含有附加问题并将其作为录取依据，请理解。</li>
          </ol>
        </div>
      </AccordionContent>
    </AccordionItem>
  </Accordion>
</template>
