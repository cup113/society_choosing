<script setup lang="ts">
import { useUserStore } from '@/stores/user';
import { useSocietyStore } from '@/stores/society';

import { Button } from '@/components/ui/button';
import SocietyCard from '@/components/SocietyCard.vue';
import ChoiceComboBox from '@/components/ChoiceComboBox.vue';

import router from '@/router';

const userStore = useUserStore();
const societyStore = useSocietyStore();

function submit() {
  if (userStore.choice.first_choice === undefined) {
    alert('请选择第一志愿');
    return;
  }
  if (userStore.choice.second_choice === undefined) {
    alert('请选择第二志愿');
    return;
  }
  if (userStore.choice.third_choice === undefined) {
    alert('请选择第三志愿');
    return;
  }
  const data = {
    token: userStore.token,
    user: userStore.userID,
    first_choice: userStore.choice.first_choice,
    second_choice: userStore.choice.second_choice,
    third_choice: userStore.choice.third_choice,
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
      throw new Error('Network response was not ok');
    }
  }).then(data => {
    console.log(data);
    router.replace('/thanks');
  })
}
</script>

<template>
  <main class="flex flex-col gap-4">
    <div class="flex flex-wrap justify-around grow p-8 mb-64 gap-1">
      <SocietyCard v-for="society in societyStore.societies" :key="society.id" :society="society" />
    </div>
    <div>
      <div class="fixed bottom-0 border-2 shadow-lg bg-cream w-full flex items-center justify-around pt-4 pb-2">
        <div class="flex flex-col gap-1">
          <ChoiceComboBox v-for="batch in userStore.batches" :key="batch.key" :batch="batch"></ChoiceComboBox>
        </div>
        <Button @click="submit()" class="submit-btn relative w-20 my-8">提交</Button>
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
