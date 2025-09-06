<script setup lang="ts">
import { computed, ref } from 'vue';
import { useUserStore } from '@/stores/user';
import { useSocietyStore } from '@/stores/society';
import { Fetcher } from '@/lib/fetch';
import router from '@/router';
import Waiting from '@/components/Waiting.vue';
import ConfirmChoice from '@/components/ConfirmChoice.vue';
import { useErrorStore } from '@/stores/error';
import ChooseGuide from '@/components/ChooseGuide.vue';
import ChooseList from '@/components/ChooseSocietyList.vue';
import ChooseForm from '@/components/ChooseForm.vue';

const userStore = useUserStore();
const societyStore = useSocietyStore();
const errorStore = useErrorStore();

const waiting = ref(false);
const waiting_confirm = ref(false);

function submit() {
  const errors = new Array<string>();
  userStore.batches.forEach(batch => {
    if (!userStore.choices[batch.index]) {
      errors.push(`请选择 ${batch.name}。`);
    }
  });
  const set = new Set(userStore.choices.filter(choice => choice !== undefined));
  if (set.size !== userStore.choices.filter(choice => choice !== undefined).length) {
    errors.push('请勿重复选择志愿。');
  }
  if (societyStore.questions && !userStore.answer.trim()) {
    errors.push(`请回答问题：${societyStore.questions}`);
  }

  if (errors.length > 0) {
    errorStore.add_error(...errors);
    return;
  }
  waiting_confirm.value = true;
}

function submit_confirmed() {
  waiting_confirm.value = false;
  waiting.value = true;
  new Fetcher<{ success: true }>({
    url: '/api/choose',
    method: 'POST',
    data: JSON.stringify({
      choices: userStore.choices,
      answers: userStore.answer,
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

const choiceNames = computed(() => {
  const get_name = (id: string | undefined) => id ? societyStore.get_society(id)?.name : undefined;
  return userStore.choices.map(id => get_name(id)!);
});

const favoriteSocieties = computed(() => {
  return societyStore.societies.filter(society => userStore.favorites.includes(society.id));
});
</script>

<template>
  <main class="flex flex-col gap-4 py-6 pb-48">
    <ChooseGuide />

    <div class="text-center py-2 mx-auto md:w-lg lg:w-3xl" v-if="societyStore.historyChoice !== null">
      <div class="text-xl text-amber-600 bg-amber-200 rounded-md py-4 px-4">
        <p>注意：您已经在 {{ societyStore.historyChoice.updated.format("MM-DD HH:mm:ss") }} 进行过选课，<strong class="text-red-600">无需再次选择</strong>。</p>
        <p>若您确实需要进行修改，请理解本系统<strong class="text-red-600">将修改后的时间作为录取的排序依据。</strong></p>
      </div>
    </div>

    <ChooseList title="所有社团" :societies="societyStore.societies" is-main />

    <ChooseList title="已收藏社团" :societies="favoriteSocieties" />

    <ChooseForm @submit="submit" />

    <Waiting :show="waiting">
      <div class="text-lg">正在提交选课...</div>
    </Waiting>

    <ConfirmChoice :open="waiting_confirm" @confirm-choice="submit_confirmed" @cancel-choice="waiting_confirm = false"
      :choices="choiceNames" />
  </main>
</template>