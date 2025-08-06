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
    class="w-full max-w-4xl mx-auto border-2 border-amber-300 rounded-xl shadow-md bg-gradient-to-br from-amber-50 to-white"
    default-value="guide" type="single" :collapsible="true">
    <AccordionItem value="guide">
      <AccordionTrigger class="px-6 py-4 hover:bg-amber-100 rounded-t-xl">
        <h2 class="text-center w-full font-bold text-xl text-amber-800">选课指引</h2>
      </AccordionTrigger>
      <AccordionContent class="px-6 pb-6 pt-4">
        <div class="space-y-3 text-gray-700">
          <p class="font-medium text-amber-700">请仔细阅读以下选课指引：</p>
          <ol class="list-decimal pl-5 space-y-2">
            <li>您可以先浏览每个社团及其介绍，在感兴趣的社团右下角点击<strong class="text-amber-700">"收藏"</strong>以便最终填报选择。</li>
            <li>填报时，确保您满足社团的限制（若有）。</li>
            <li><strong class="text-amber-700">志愿优先，同一志愿先到先得。</strong>以下两条建议可以有效防止您滑档。</li>
            <li><strong class="text-amber-700">兴趣优先。</strong>社团不分高下，不必追寻热门。适合自己的就是最好的。</li>
            <li><strong class="text-amber-700">在第二/三志愿填报您比较感兴趣的非热门社团保底。</strong>对于备注了去年录取截止批次及时间的社团，请您尽量不要将其选为第三志愿。</li>
          </ol>
        </div>
      </AccordionContent>
    </AccordionItem>
  </Accordion>
</template>
