<script lang="ts" setup>
import { ref, computed } from 'vue';
import { useMediaQuery, createReusableTemplate } from '@vueuse/core';

import { useUserStore, type Batch } from '@/stores/user';
import { useSocietyStore } from '@/stores/society';

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Check, ChevronsUpDown } from 'lucide-vue-next';

const props = defineProps<{
  batch: Batch;
}>();

const userStore = useUserStore();
const societyStore = useSocietyStore();

const open = ref(false);
const isDesktop = useMediaQuery('(min-width: 1024px)');
const [UseCommandTemplate, CommandTemplate] = createReusableTemplate();

const societyName = computed({
  get() {
    const society = societyStore.get_society(userStore.choices[props.batch.index] ?? '');
    return society ? `${society.index} ${society.name}` : undefined;
  },
  set(value: string | undefined) {
    if (value === undefined) {
      userStore.choices[props.batch.index] = undefined;
    } else {
      userStore.choices[props.batch.index] = societyStore.get_society_id(value.slice(3))!;
    }
  },
});

const nameDisplayed = computed(() => {
  return societyName.value?.slice(3) ?? '请选择社团';
});
</script>

<template>
  <div class="flex items-center gap-2">
    <UseCommandTemplate>
      <Command v-model="name">
        <CommandInput placeholder="搜索社团名称..."></CommandInput>
        <CommandEmpty>没有包含该名称的社团。</CommandEmpty>
        <CommandList>
          <CommandGroup>
            <CommandItem v-for="society in societyStore.societies" :key="society.id"
              :value="society.index + ' ' + society.name" @select="open = false">
              <Check class="mr-2 h-2 w-4" :class="{ 'opacity-0': society.name !== name }"></Check>
              {{ society.index }} {{ society.name }}
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </UseCommandTemplate>
    <div class="text-lg font-bold">{{ batch.name }}</div>
    <div v-if="isDesktop">
      <Popover v-model:open="open">
        <PopoverTrigger as-child>
          <Button variant="outline" role="combobox" class="w-32 justify-between" :aria-expanded="open">
            {{ nameDisplayed }}
            <ChevronsUpDown class="ml-2 h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent side="top">
          <CommandTemplate></CommandTemplate>
        </PopoverContent>
      </Popover>
    </div>
    <div v-else>
      <Drawer v-model:open="open">
        <DrawerTrigger as-child>
          <Button variant="outline" role="combobox" class="w-32 justify-between" :aria-expanded="open">
            {{ nameDisplayed }}
            <ChevronsUpDown class="ml-2 h-4 w-4 opacity-50" />
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <CommandTemplate></CommandTemplate>
        </DrawerContent>
      </Drawer>
    </div>
  </div>
</template>
