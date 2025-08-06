<script setup lang="ts">
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

defineProps<{
  showLogin: boolean
}>();

defineEmits<{
  (e: 'update:showLogin', value: boolean): void
}>();
</script>

<template>
  <div class="w-full max-w-md">
    <Accordion type="single" collapsible>
      <AccordionItem value="login" class="border rounded-lg overflow-hidden">
        <AccordionTrigger
          class="font-bold px-4 py-3 w-full text-center bg-amber-100 hover:bg-amber-200 text-amber-800 transition-colors"
          :class="{ 'bg-green-100 hover:bg-green-200 text-green-800': !showLogin }">
          <div class="flex items-center justify-center gap-2">
            <div class="w-3 h-3 rounded-full" :class="showLogin ? 'bg-amber-500' : 'bg-green-500'"></div>
            <span>
              {{ showLogin ? '您已登录，点击展开重新登录' : '您已登录，点击展开登录表单' }}
            </span>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <slot></slot>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  </div>
</template>
