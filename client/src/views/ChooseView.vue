<script setup lang="ts">
import { computed, ref } from 'vue';

import { useUserStore, type Batch } from '@/stores/user';
import { useSocietyStore } from '@/stores/society';
import { Fetcher } from '@/lib/fetch';
import router from '@/router';

import SocietyCard from '@/components/SocietyCard.vue';
import ChoiceComboBox from '@/components/ChoiceComboBox.vue'
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
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
  userStore.batches.forEach(batch => {
    if (userStore.choices[batch.index] === undefined) {
      errors.push(`请选择 ${batch.name} 志愿。`);
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
  confirm_choice();
}

function submit_confirmed() {
  waiting_confirm.value = false;
  waiting.value = true;
  new Fetcher<{ success: true }>({
    url: '/api/choose',
    method: 'POST',
    data: JSON.stringify({
      choices: userStore.choices,
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

const choiceNames = computed(() => {
  const get_name = (id: string | undefined) => id ? societyStore.get_society(id)?.name : undefined;

  return userStore.choices.map(id => get_name(id)!);
});

const favoriteSocieties = computed(() => {
  return societyStore.societies.filter(society => userStore.favorites.includes(society.id));
});
</script>

<template>
  <main class="flex flex-col gap-4">
    <Collapsible class="w-xs md:w-lg lg:w-2xl py-2 px-2 mx-auto border-slate-500 border-2 rounded-lg"
      :default-open="true">
      <CollapsibleTrigger as-child>
        <h2 class="text-center font-bold text-xl mb-2">选课指引</h2>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div class="indent-8">
          <p>您可以先浏览每个社团及其介绍，在感兴趣的社团右下角点击“收藏”以便最终填报选择。</p>
          <p>填报时，确保您满足社团的限制（若有），并且对填报的社团感兴趣。</p>
          <p>录取时，<strong>志愿优先，同一志愿先到先得。</strong>为了防止三个志愿都未成功录取而被调剂的情况出现，请遵循以下建议：</p>
          <ol>
            <li>1. <strong>兴趣优先。</strong>不要为了热门而填报热门社团，会增大您此批次无法录取的概率。</li>
            <li>2. <strong>在第二/三志愿填报您比较感兴趣的非热门社团保底。</strong>对于备注了去年录取截止批次及时间的社团，请您尽量不要将其选为第三志愿。</li>
          </ol>
        </div>
      </CollapsibleContent>
    </Collapsible>
    <div class="flex flex-wrap justify-center grow py-8 px-2 mb-2 gap-y-4 gap-x-8 md:w-2xl lg:w-5xl mx-auto">
      <SocietyCard v-for="society in societyStore.societies" :key="society.id" :society="society" />
    </div>
    <h2 class="font-bold text-center text-2xl" v-show="favoriteSocieties">已收藏</h2>
    <div class="flex flex-wrap justify-center grow py-8 px-2 mb-64 gap-y-4 gap-x-8 md:w-2xl lg:w-5xl mx-auto">
      <SocietyCard v-for="society in favoriteSocieties" :key="society.id" :society="society" />
    </div>
    <div class="fixed bottom-0 border-2 shadow-lg bg-[#fde1ba] w-full flex flex-col items-center  pt-4 pb-2">
      <div class="flex items-center justify-center gap-4 md:gap-8 lg:gap-12 md:px-8">
        <div class="flex flex-col md:flex-row md:flex-wrap md:gap-x-8 md:justify-center lg:flex-nowrap gap-1">
          <ChoiceComboBox v-for="batch in userStore.batches" :key="batch.name" :batch="batch"></ChoiceComboBox>
        </div>
        <Button v-if="societyStore.timeStatus?.open && !societyStore.coreMemberOf" @click="submit()"
          class="submit-btn relative w-20 my-8 bg-amber-700 hover:bg-amber-800">提交</Button>
      </div>
      <div class="px-4 flex flex-col md:flex-row gap-2" v-if="societyStore.questions.length > 0">
        <div>
          <p><b>附加问题：</b></p>
          <p>{{ societyStore.questions }}</p>
        </div>
        <Textarea class="max-w-80" v-model="userStore.answer" placeholder="请输入答案..."></Textarea>
      </div>
    </div>
    <Waiting :show="waiting">
      <div>正在提交选课...</div>
    </Waiting>
    <ConfirmChoice :open="waiting_confirm" @confirm-choice="submit_confirmed" @cancel-choice="waiting_confirm = false"
      :choices="choiceNames"></ConfirmChoice>
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
