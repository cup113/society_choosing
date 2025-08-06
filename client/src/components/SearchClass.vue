<script setup lang="ts">
import { ref } from 'vue';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverTrigger,
  PopoverContent
} from '@/components/ui/popover';
import {
  Command,
  CommandInput,
  CommandList,
  CommandGroup,
  CommandItem,
  CommandEmpty
} from '@/components/ui/command';
import { ChevronsUpDown, UsersIcon, Check } from 'lucide-vue-next';

defineProps<{
  classes: string[];
  placeholder?: string;
}>();

const modelValue = defineModel<string>();

const open = ref(false);
</script>

<template>
  <div class="flex items-center gap-3 justify-center bg-white p-3 rounded-xl shadow-sm border border-amber-200">
    <UsersIcon class="w-5 h-5 text-amber-600" />
    <span class="font-medium text-amber-800">选择班级</span>
    <Popover v-model:open="open">
      <PopoverTrigger as-child>
        <Button variant="outline" role="combobox"
          class="w-64 justify-between bg-amber-50 hover:bg-amber-100 border-amber-300" :aria-expanded="open">
          <span class="truncate">{{ modelValue || "请选择班级" }}</span>
          <ChevronsUpDown class="ml-2 h-4 w-4 opacity-50 shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent side="bottom" align="start" class="w-64 p-0 border-2 border-amber-300 rounded-xl shadow-lg">
        <Command v-model="modelValue">
          <div class="relative">
            <UsersIcon class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <CommandInput placeholder="搜索班级名称..." class="pl-10" />
          </div>
          <CommandEmpty class="py-4 text-center text-gray-500">
            <div class="flex flex-col items-center justify-center">
              <div class="bg-gray-200 border-2 border-dashed rounded-xl w-12 h-12 mb-2" />
              没有找到相关班级
            </div>
          </CommandEmpty>
          <CommandList class="max-h-60">
            <CommandGroup>
              <CommandItem v-for="_class in classes" :key="_class" :value="_class" @select="() => {
                modelValue = _class;
                open = false;
              }" class="flex items-center justify-between py-2 px-3 hover:bg-amber-50 rounded-lg transition-colors">
                <span class="truncate">{{ _class }}</span>
                <Check class="h-4 w-4 text-amber-600"
                  :class="{ 'opacity-100': _class === modelValue, 'opacity-0': _class !== modelValue }" />
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  </div>
</template>
