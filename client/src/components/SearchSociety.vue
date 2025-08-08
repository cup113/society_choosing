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
import { ChevronsUpDown, SearchIcon, Check } from 'lucide-vue-next';

const props = defineProps<{
  modelValue: string;
  societies: any[];
  placeholder?: string;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

const open = ref(false);
const searchValue = ref(props.modelValue);

defineExpose({
  reset: () => {
    searchValue.value = '';
    emit('update:modelValue', '');
  }
});
</script>

<template>
  <div class="flex items-center gap-3 justify-center bg-white p-3 rounded-xl shadow-card">
    <SearchIcon class="w-5 h-5 text-amber-600" />
    <span class="font-medium text-amber-800">选择社团</span>
    <Popover v-model:open="open">
      <PopoverTrigger as-child>
        <Button variant="outline" role="combobox"
          class="w-64 justify-between bg-amber-50 hover:bg-amber-100 border-amber-300" :aria-expanded="open">
          <span class="truncate">{{ modelValue || "请选择社团" }}</span>
          <ChevronsUpDown class="ml-2 h-4 w-4 opacity-50 shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent side="bottom" align="start" class="w-64 p-0 border-2 border-amber-300 rounded-xl shadow-lg">
        <Command v-model="searchValue">
          <div class="relative">
            <SearchIcon class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <CommandInput placeholder="搜索社团名称..." class="pl-10" />
          </div>
          <CommandEmpty class="py-4 text-center text-gray-500">
            <div class="flex flex-col items-center justify-center">
              <div class="bg-gray-200 border-2 border-dashed rounded-xl w-12 h-12 mb-2" />
              没有找到相关社团
            </div>
          </CommandEmpty>
          <CommandList class="max-h-60">
            <CommandGroup>
              <CommandItem v-for="society in societies" :key="society.id" :value="society.name" @select="() => {
                emit('update:modelValue', society.name);
                open = false;
              }" class="flex items-center justify-between py-2 px-3 hover:bg-amber-50 rounded-lg transition-colors">
                <span class="truncate">{{ society.name }}</span>
                <Check class="h-4 w-4 text-amber-600"
                  :class="{ 'opacity-100': society.name === modelValue, 'opacity-0': society.name !== modelValue }" />
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  </div>
</template>
