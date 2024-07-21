<script setup lang="ts">
import { ref } from 'vue';
import { useUserStore } from '@/stores/user';

import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from '@/components/ui/table';
import router from '@/router';

interface Society {
  id: string;
  name: string;
  cap: number;
}
const store = useUserStore();

const OPTIONS = ['第一志愿', '第二志愿', '优先调剂', '不选择']
const societies = ref(new Array<Society>());
fetch('/api/societies/list').then(response => response.json()).then(data => {
  societies.value = data;
});

function submit() {
  let arranged: string[][] = [[], [], []];
  Object.entries(store.choice).forEach(([id, option]) => {
    if (option === '第一志愿') {
      arranged[0].push(id);
    } else if (option === '第二志愿') {
      arranged[1].push(id);
    } else if (option === '优先调剂') {
      arranged[2].push(id);
    }
  });
  if (arranged[0].length === 0) {
    alert('请选择第一志愿');
    return;
  }
  if (arranged[0].length > 1) {
    alert('请选择唯一的第一志愿');
    return;
  }
  if (arranged[1].length === 0) {
    alert('请选择第二志愿');
    return;
  }
  if (arranged[1].length > 1) {
    alert('请选择唯一的第二志愿');
    return;
  }
  const data = {
    token: store.token,
    user: store.userID,
    'first_choice': arranged[0][0],
    'second_choice': arranged[1][0],
    'adjust_prior': arranged[2],
  };
  fetch('/api/choose', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  }).then(response => {
    if (response.ok) {
        return response.json();
    } else {
        alert('Network response ' + response.status.toString());
        throw new Error('Network response was not ok'); // TODO error feedback
    }
  }).then(data => {
    console.log(data);
    router.replace('/thanks');
  })
}
</script>

<template>
  <main>
    <h1 class="text-center font-bold text-3xl">社团选课系统</h1>
    <Table>
      <TableRow>
        <TableHead>社团名称</TableHead>
        <TableHead>限额（人）</TableHead>
        <TableHead>操作</TableHead>
      </TableRow>
      <TableBody>
        <TableRow v-for="society in societies" :key="society.id">
          <TableCell>{{ society.name }}</TableCell>
          <TableCell>{{ society.cap }}</TableCell>
          <TableCell>
            <span v-for="option, i in OPTIONS" :key="option">
              <input type="radio" :name="society.id" :id="society.id + '_' + i" :value="option"
                v-model="store.choice[society.id]">
              <label :for="society.id + '_' + i">{{ option }}</label>
            </span>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
    <Button @click="submit()">提交</Button>
  </main>
</template>
