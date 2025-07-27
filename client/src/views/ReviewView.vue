<script lang="ts" setup>
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell, TableCaption } from '@/components/ui/table';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { ChevronsUpDown, Check } from 'lucide-vue-next';
import { Command, CommandInput, CommandList, CommandGroup, CommandItem, CommandEmpty } from '@/components/ui/command';

import { useUserStore } from '@/stores/user';
import { useSocietyStore } from '@/stores/society';

import { Fetcher } from '@/lib/fetch';
import { ref, watch } from 'vue';
import type { ListSocietyUserResponse, ListSocietyUser } from '../../../types/types.d.ts';

const userStore = useUserStore();
const societyStore = useSocietyStore();

const societyName = ref("");
const open = ref(false);
const users = ref({
  first_choice: [],
  second_choice: [],
  third_choice: [],
} as ListSocietyUserResponse)

// TODO temporarily unavailable

watch(societyName, () => {
  if (!societyName.value) {
    return;
  }
  new Fetcher<ListSocietyUserResponse>({
    url: `/api/review/list?societyID=${societyStore.get_society_id(societyName.value)}`,
    method: "GET",
  }).fetch_json().then(data => users.value = data);
}, { immediate: true });

function toggle_reject(user: ListSocietyUser) {
  const targetReject = !user.rejected;
  new Fetcher<void>({
    url: `/api/review/toggle?reject`,
    method: "POST",
    data: JSON.stringify({
      reject: targetReject,
      userID: user.id,
      societyID: societyStore.get_society_id(societyName.value),
    })
  }).fetch_json().then(() => {
    user.rejected = targetReject;
  })
}

</script>

<template>
  <div class="flex flex-col gap-4 w-[50rem] mx-auto">
    <div class="text-center">
      请选择需要审核的社团：
      <Popover v-model:open="open">
        <PopoverTrigger as-child>
          <Button variant="outline" role="combobox" class="w-48 justify-between" :aria-expanded="open">
            {{ societyName }}
            <ChevronsUpDown class="ml-2 h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent side="top">
          <Command v-model="societyName">
            <CommandInput placeholder="搜索社团名称..."></CommandInput>
            <CommandEmpty>没有包含该名称的社团。</CommandEmpty>
            <CommandList>
              <CommandGroup>
                <CommandItem v-for="society in societyStore.societies" :key="society.id" :value="society.name"
                  @select="open = false">
                  <Check class="mr-2 h-2 w-4" :class="{ 'opacity-0': society.name !== societyName }"></Check>
                  {{ society.name }}
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
    <Table v-for="batch in userStore.batches" :key="batch.key">
      <TableCaption><b>{{ batch.name }}</b> 审核退档</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>序号</TableHead>
          <TableHead>姓名</TableHead>
          <TableHead>班级</TableHead>
          <TableHead>附加问题回答</TableHead>
          <TableHead>操作</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-for="(user, index) in users[batch.key]" :key="user.id">
          <TableCell>{{ index + 1 }}</TableCell>
          <TableCell>{{ user.name }}</TableCell>
          <TableCell>{{ user.class }}</TableCell>
          <TableCell>{{ user.answer }}</TableCell>
          <TableCell><Button :variant="user.rejected ? 'secondary' : 'destructive'" @click="toggle_reject(user)">{{ user.rejected ? '重新接受' : '退档拒收' }}</Button></TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
</template>
