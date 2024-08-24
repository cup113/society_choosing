<script setup lang="ts">
import { ref } from 'vue';

import { useUserStore } from '@/stores/user';
import { useSocietyStore } from '@/stores/society';

import { Button } from '@/components/ui/button';
import SocietyCard from '@/components/SocietyCard.vue';
import ChoiceComboBox from '@/components/ChoiceComboBox.vue';
import Waiting from '@/components/Waiting.vue';

import router from '@/router';

const userStore = useUserStore();
const societyStore = useSocietyStore();

const waiting = ref(false);

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
  if (userStore.choice.first_choice === userStore.choice.second_choice || userStore.choice.first_choice === userStore.choice.third_choice || userStore.choice.second_choice === userStore.choice.third_choice) {
    alert('请勿选择相同的志愿');
    return;
  }
  if (!confirm('确认提交选课？')) {
    return;
  }
  waiting.value = true;
  const data = {
    token: userStore.token,
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
      waiting.value = false;
      throw new Error('提交失败: ' + response.status.toString());
    }
  }).then(data => {
    waiting.value = false;
    societyStore.refresh_society_history();
    console.log(data);
    router.replace('/thanks');
  }).catch(error => {
    console.error(error);
    alert(error.message);
  })
}
</script>

<template>
  <main class="flex flex-col gap-4">
    <div class="flex flex-wrap justify-center grow py-8 px-2 mb-64 gap-y-4 gap-x-8 md:w-[640px] lg:w-[900px] mx-auto">
      <SocietyCard v-for="society in societyStore.societies" :key="society.id" :society="society" />
    </div>
    <div>
      <div class="fixed bottom-0 border-2 shadow-lg bg-[#fde1ba] w-full flex items-center justify-center pt-4 pb-2 gap-4 md:gap-8 lg:gap-12 md:px-8">
        <div class="flex flex-col md:flex-row md:flex-wrap md:gap-x-8 md:justify-center lg:flex-nowrap gap-1">
          <ChoiceComboBox v-for="batch in userStore.batches" :key="batch.key" :batch="batch"></ChoiceComboBox>
        </div>
        <Button @click="submit()" class="submit-btn relative w-20 my-8 bg-amber-700">提交</Button>
      </div>
    </div>
    <Waiting :show="waiting">
      <div>正在提交选课...</div>
    </Waiting>
  </main>
</template>

<style>
.submit-btn::before {
  @apply absolute -right-1 bg-contain;
  width: 44px;
  height: 30px;
  top: -30px;
  content: "";
  background-image: url('/img/button-bird.png');
}
</style>
