<script lang="ts" setup>
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell, TableCaption } from '@/components/ui/table';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { ChevronsUpDown, Check } from 'lucide-vue-next';
import { Command, CommandInput, CommandList, CommandGroup, CommandItem, CommandEmpty } from '@/components/ui/command';

import { useUserStore } from '@/stores/user';
import { useSocietyStore } from '@/stores/society';

import { Fetcher } from '@/lib/fetch';
import { ref, reactive, watch, computed, onMounted } from 'vue';
import type { AdmissionResult, AdmittedSociety, AdmittedUser } from '../../../types/types.d.ts';

const userStore = useUserStore();
const societyStore = useSocietyStore();

const admissionResult = reactive<AdmissionResult>({
  users: [],
  societies: [],
});

onMounted(() => {
  new Fetcher<AdmissionResult>({
    url: '/api/review/dashboard',
    method: 'GET',
  }).fetch_json().then(data => {
    admissionResult.users = data.users;
    admissionResult.societies = data.societies;
  })
});

const tableUsers = computed(() => {
  return admissionResult.users.map(user => {
    const submitDisplay = (user.submit / 1000).toFixed(3)
    return {
      class: user.class,
      name: user.name,
      society: user.society?.name ?? "未录取",
      submit: submitDisplay,
      choices: [
        user.choices?.[0]?.name ?? "未选择",
        user.choices?.[1]?.name ?? "未选择",
        user.choices?.[2]?.name ?? "未选择",
      ],
    }
  });
});

const tableSocieties = computed(() => {
  return admissionResult.societies.map(society => {
    return {
      name: society.name,
      cap: society.cap,
      countMembers: society.countMembers,
      lastBatch: society.lastBatch,
      lastTime: society.lastTime,
    }
  })
})

function toggle_reject(user: AdmittedUser, society: AdmittedSociety) {
  const targetReject = !user.rejects.some(reject => reject.id == society.id);
  new Fetcher<void>({
    url: `/api/review/toggle?reject`,
    method: "POST",
    data: JSON.stringify({
      reject: targetReject,
      userID: user.id,
      societyID: society.id,
    })
  }).fetch_json().then(() => {
    if (targetReject) {
      user.rejects.push(society);
    } else {
      user.rejects.splice(user.rejects.findIndex(reject => reject.id == society.id), 1)
    }
  })
}

</script>

<template>
  <div class="flex flex-col gap-4 w-4xl py-4 mx-auto">
    <table>
      <table-header>
        <table-row>
          <table-head>班级</table-head>
          <table-head>姓名</table-head>
          <table-head>录取社团</table-head>
          <table-head>选课时间</table-head>
          <table-head>第一志愿</table-head>
          <table-head>第二志愿</table-head>
          <table-head>第三志愿</table-head>
        </table-row>
      </table-header>
      <table-body>
        <table-row v-for="user in tableUsers">
          <table-cell>{{ user.class }}</table-cell>
          <table-cell>{{ user.name }}</table-cell>
          <table-cell>{{ user.society }}</table-cell>
          <table-cell>{{ user.submit }}</table-cell>
          <table-cell>{{ user.choices[0] }}</table-cell>
          <table-cell>{{ user.choices[1] }}</table-cell>
          <table-cell>{{ user.choices[2] }}</table-cell>
        </table-row>
      </table-body>
      <table-caption>学生原始数据</table-caption>
    </table>
    <table>
      <table-header>
        <table-row>
          <table-head>社团名称</table-head>
          <table-head>限额</table-head>
          <table-head>实录人数</table-head>
          <table-head>各批次录取人数</table-head>
          <table-head>各批次报名人数</table-head>
          <table-head>志愿线</table-head>
          <table-head>时间线</table-head>
        </table-row>
      </table-header>
      <table-body>
        <table-row v-for="society in tableSocieties">
          <table-cell>{{ society.name }}</table-cell>
          <table-cell>{{ society.cap }}</table-cell>
          <table-cell>{{ society.countMembers }}</table-cell>
          <table-cell></table-cell>
          <table-cell></table-cell>
          <table-cell>{{ society.lastBatch }}</table-cell>
          <table-cell>{{ society.lastTime }}</table-cell>
        </table-row>
      </table-body>
      <table-caption>社团统计数据</table-caption>
    </table>
    <h2>录取情况——按社团分 & 审核</h2>
    <h2>录取情况——按班级分</h2>
  </div>
</template>
