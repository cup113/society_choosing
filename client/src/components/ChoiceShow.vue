<script lang="ts" setup>
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';

const slots = defineSlots<{
  title(props: {}): any,
  description(props: {}): any,
  extra?(props: {}): any,
  footer?(props: {}): any,
}>();

const props = defineProps<{
  choice: {
    first_choice?: string,
    second_choice?: string,
    third_choice?: string,
  }
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
        <p>第一志愿: <b>{{ props.choice.first_choice }}</b></p>
        <p>第二志愿: <b>{{ props.choice.second_choice }}</b></p>
        <p>第三志愿: <b>{{ props.choice.third_choice }}</b></p>
        <slot name="extra"></slot>
      </div>
    </CardContent>
    <CardFooter v-if="slots.footer">
      <slot name="footer"></slot>
    </CardFooter>
  </Card>
</template>
