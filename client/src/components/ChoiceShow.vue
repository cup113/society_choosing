<script lang="ts" setup>
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';

const slots = defineSlots<{
  title(props: {}): any,
  description(props: {}): any,
  extra?(props: {}): any,
  footer?(props: {}): any,
}>();

const props = defineProps<{
  choice: string[];
}>();

</script>

<template>
  <Card class="text-center">
    <CardHeader>
      <CardTitle>
        <slot name="title"></slot>
      </CardTitle>
      <CardDescription>
        <slot name="description"></slot>
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div class="flex flex-col gap-1">
        <p v-for="choice, i in choice" :key="choice">
          第 <b>{{ i + 1 }}</b> 志愿：{{ choice }}
        </p>
        <slot name="extra"></slot>
      </div>
    </CardContent>
    <CardFooter v-if="slots.footer">
      <slot name="footer"></slot>
    </CardFooter>
  </Card>
</template>
