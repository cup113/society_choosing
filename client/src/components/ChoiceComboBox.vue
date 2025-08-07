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
import { Drawer, DrawerHeader, DrawerTitle, DrawerDescription, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Check, ChevronsUpDown, SearchIcon } from 'lucide-vue-next';

const props = defineProps<{
  batch: Batch;
}>();

const userStore = useUserStore();
const societyStore = useSocietyStore();

const open = ref(false);
const isDesktop = useMediaQuery('(min-width: 1024px)');
const [UseCommandTemplate, CommandTemplate] = createReusableTemplate();

const name = computed({
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
  return name.value?.slice("00 ".length) ?? '请选择社团';
});

const selectedSociety = computed(() => {
  return societyStore.get_society(userStore.choices[props.batch.index] ?? '');
});
</script>

<template>
  <div class="flex flex-row items-start sm:items-center w-full">
    <div class="flex items-center h-full w-auto bg-amber-600 text-white font-bold py-1 rounded-l-lg text-sm">
      <div class="px-2 w-20 text-center">
        {{ batch.name }}
      </div>

      <UseCommandTemplate>
        <Command v-model="name">
          <div class="relative">
            <SearchIcon class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <CommandInput placeholder="搜索社团名称..." class="pl-4" />
          </div>
          <CommandEmpty class="py-4 text-center text-gray-500">
            <div class="flex flex-col items-center justify-center">
              <div class="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mb-2" />
              没有找到相关社团
            </div>
          </CommandEmpty>
          <CommandList class="max-h-60">
            <CommandGroup>
              <CommandItem v-for="society in societyStore.societies" :key="society.id"
                :value="society.index + ' ' + society.name" @select="open = false"
                class="flex items-center justify-between py-3 px-2 hover:bg-amber-50 rounded-lg transition-colors">
                <div class="flex items-center">
                  <span class="text-gray-500 w-8">{{ society.index }}</span>
                  <span>{{ society.name }}</span>
                </div>
                <Check class="h-5 w-5 text-amber-600"
                  :class="{ 'opacity-100': society.id === selectedSociety?.id, 'opacity-0': society.id !== selectedSociety?.id }" />
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </UseCommandTemplate>
    </div>

    <div class="w-full sm:w-64" v-if="isDesktop">
      <Popover v-model:open="open">
        <PopoverTrigger as-child>
          <Button variant="outline" role="combobox"
            class="w-full justify-between bg-white border-2 border-amber-300 hover:bg-amber-50 rounded-r-lg rounded-l-none border-l-0 h-10 shadow-sm"
            :class="{ 'border-amber-500': selectedSociety }" :aria-expanded="open">
            <span class="truncate" :class="{ 'text-gray-500': !selectedSociety }">
              {{ selectedSociety ? nameDisplayed : '请选择社团' }}
            </span>
            <ChevronsUpDown class="ml-2 h-4 w-4 opacity-50 shrink-0" />
          </Button>
        </PopoverTrigger>
        <PopoverContent side="top" align="start" class="w-full p-0 border-2 border-amber-300 rounded-xl shadow-lg">
          <CommandTemplate></CommandTemplate>
        </PopoverContent>
      </Popover>
    </div>

    <div class="w-full sm:w-64" v-else>
      <Drawer v-model:open="open">
        <DrawerTrigger as-child>
          <Button variant="outline" role="combobox"
            class="w-full justify-between bg-white border-y-2 border-r-2 border-amber-300 hover:bg-amber-50 h-10 shadow-sm rounded-none rounded-r-lg"
            :class="{ 'border-amber-500': selectedSociety }" :aria-expanded="open">
            <span class="truncate" :class="{ 'text-gray-500': !selectedSociety }">
              {{ selectedSociety ? selectedSociety.name : '请选择社团' }}
            </span>
            <ChevronsUpDown class="ml-2 h-4 w-4 opacity-50 shrink-0" />
          </Button>
        </DrawerTrigger>
        <DrawerContent class="border-2 border-amber-300 rounded-t-2xl bottom-0 w-full">
          <div class="px-4 pt-4">
            <div class="w-12 h-1.5 bg-amber-300 rounded-full mx-auto mb-4"></div>
            <DrawerHeader>
              <DrawerTitle>志愿填报 选择社团</DrawerTitle>
              <DrawerDescription>请选择<strong>{{ batch.name }}</strong>批次所需填报的社团。</DrawerDescription>
            </DrawerHeader>
            <CommandTemplate></CommandTemplate>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  </div>
</template>
