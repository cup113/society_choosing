<script setup lang="ts">
import { computed, ref } from 'vue';

import { useUserStore } from '@/stores/user';
import { useSocietyStore } from '@/stores/society';
import { Fetcher } from '@/lib/fetch';
import router from '@/router';

import { Button } from '@/components/ui/button';
import SocietyCard from '@/components/SocietyCard.vue';
import { Textarea } from '@/components/ui/textarea';

import Waiting from '@/components/Waiting.vue';
import ConfirmChoice from '@/components/ConfirmChoice.vue';
import { useErrorStore } from '@/stores/error';

const userStore = useUserStore();
const societyStore = useSocietyStore();
const errorStore = useErrorStore();

const waiting = ref(false);
const waiting_confirm = ref(false);

function confirm_choice() {
  waiting_confirm.value = true;
}

function submit() {
  const errors = new Array<string>();
  // TODO check
  if (errors.length > 0) {
    errorStore.add_error(...errors);
    return;
  }
  confirm_choice();
}

function submit_confirmed() {
  waiting_confirm.value = false;
  waiting.value = true;
  new Fetcher<{ success: true }>({
    url: '/api/choose',
    method: 'POST',
    data: JSON.stringify({
      ...userStore.choice,
      answer: userStore.answer,
    }),
  }).fetch_json().then(data => {
    waiting.value = false;
    societyStore.refresh_society_history();
    console.log(data);
    router.replace('/thanks');
  }).catch(error => {
    waiting.value = false;
    console.error(error);
    errorStore.add_error(`提交选课失败，请稍后再试或尝试重新登录: ${error.message.toString()}`);
  })
}

const choiceName = computed(() => {
  const get_name = (id: string | undefined) => id ? societyStore.get_society(id) : undefined;
  // TODO
  throw "unimplemented";
})
</script>

<template>
  <main class="flex flex-col gap-4">
    <div class="flex flex-wrap justify-center grow py-8 px-2 mb-64 gap-y-4 gap-x-8 md:w-[640px] lg:w-[900px] mx-auto">
      <SocietyCard v-for="society in societyStore.societies" :key="society.id" :society="society" />
    </div>
    <div class="fixed bottom-0 border-2 shadow-lg bg-[#fde1ba] w-full flex flex-col items-center  pt-4 pb-2">
      <div
        class="flex items-center justify-center gap-4 md:gap-8 lg:gap-12 md:px-8">
        <div class="flex flex-col md:flex-row md:flex-wrap md:gap-x-8 md:justify-center lg:flex-nowrap gap-1">
        </div>
        <Button v-if="societyStore.timeStatus?.open && !societyStore.coreMemberOf" @click="submit()"
          class="submit-btn relative w-20 my-8 bg-amber-700 hover:bg-amber-800">提交</Button>
      </div>
      <div>
        <div class="px-4 flex flex-col md:flex-row gap-2" v-if="societyStore.question.length > 0">
          <div>
            <p><b>附加问题：</b></p>
            <p>{{ societyStore.question }}</p>
          </div>
          <Textarea class="max-w-80" v-model="userStore.answer" placeholder="请输入答案..."></Textarea>
        </div>
      </div>
    </div>
    <Waiting :show="waiting">
      <div>正在提交选课...</div>
    </Waiting>
    <ConfirmChoice :open="waiting_confirm" @confirm-choice="submit_confirmed" @cancel-choice="waiting_confirm = false"
      :choice="choiceName"></ConfirmChoice>
  </main>
</template>

<style>
@reference "tailwindcss";

.submit-btn::before {
  @apply absolute -right-1 bg-contain;
  width: 44px;
  height: 30px;
  top: -30px;
  content: "";
  background-image: url('/img/button-bird.png');
}
</style>
