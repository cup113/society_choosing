<script setup lang="ts">
import { ref, computed } from 'vue';
import { useUserStore } from '@/stores/user';

import { Button } from '@/components/ui/button';
import SocietyCard from '@/components/SocietyCard.vue';

import router from '@/router';

interface Society {
  id: string;
  name: string;
  cap: number;
}
const store = useUserStore();

const societies = ref(new Array<Society>());
fetch('/api/societies/list').then(response => response.json()).then(data => {
  societies.value = data;
});

const choice = computed(() => {
  const _choice = {
    'first_choice': new Array<string>(),
    'second_choice': new Array<string>(),
    'adjust_prior': new Array<string>(),
  };

  Object.entries(store.choice).map(([key, value]) => {
    if (value !== 'default') {
      _choice[value].push(key);
    }
  });

  return _choice;
});

function submit() {
  if (choice.value.first_choice.length === 0) {
    alert('请选择第一志愿');
    return;
  }
  if (choice.value.first_choice.length > 1) {
    alert('请选择唯一的第一志愿');
    return;
  }
  if (choice.value.second_choice.length === 0) {
    alert('请选择第二志愿');
    return;
  }
  if (choice.value.second_choice.length > 1) {
    alert('请选择唯一的第二志愿');
    return;
  }
  const data = {
    token: store.token,
    user: store.userID,
    'first_choice': store.choice.first_choice[0],
    'second_choice': store.choice.second_choice[0],
    'adjust_prior': store.choice.adjust_prior,
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
  <main class="flex flex-col gap-4">
    <h1 class="text-center font-bold text-3xl">社团选课系统</h1>
    <div class="flex flex-wrap justify-around">
      <SocietyCard v-for="society in societies" :key="society.id" :society="society" />
    </div>
    <div class="text-center">
      <Button @click="submit()">提交</Button>
    </div>
  </main>
</template>
