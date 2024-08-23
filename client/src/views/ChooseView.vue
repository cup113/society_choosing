<script setup lang="ts">
import { ref, computed } from 'vue';
import { useUserStore } from '@/stores/user';

import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
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

const get_society = (id: string) => {
  return societies.value.find(society => society.id === id);
}

const batches = [
  {
    name: "第一志愿",
    key: "first_choice",
  },
  {
    name: "第二志愿",
    key: "second_choice",
  },
  {
    name: "优先调剂",
    key: "adjust_prior",
  }
] as const;

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
    'first_choice': choice.value.first_choice[0],
    'second_choice': choice.value.second_choice[0],
    'adjust_prior': choice.value.adjust_prior,
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
    <div class="flex gap-4 p-8">
      <div class="flex flex-wrap justify-around grow">
        <SocietyCard v-for="society in societies" :key="society.id" :society="society" />
      </div>
      <div>
        <Card class="border-2 shadow-lg bg-cream min-w-48">
          <CardHeader>
            <CardTitle>志愿选择</CardTitle>
          </CardHeader>
          <CardContent>
            <div v-for="batch in batches" :key="batch.key">
              <div>{{ batch.name }}</div>
              <div class="flex flex-wrap gap-2">
                <span v-for="society in choice[batch.key]" :key="society" class="bg-slate-200 px-2 py-1 rounded-md text-sm">
                  <span>{{ get_society(society)?.name }}</span>
                </span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button @click="submit()" class="submit-btn relative w-full my-8">提交</Button><!--TODO confirm-->
          </CardFooter>
        </Card>
      </div>
    </div>
  </main>
</template>

<style>
.submit-btn::before {
  @apply absolute left-0 bg-contain;
  width: 32px;
  height: 22.5px;
  top: -22.5px;
  transform: rotateY(180deg);
  content: "";
  background-image: url('/img/button-bird.png');
}
</style>
