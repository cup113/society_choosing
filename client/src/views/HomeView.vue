<script setup lang="ts">
import { computed, ref } from 'vue';
import { createReusableTemplate } from '@vueuse/core';

import { useUserStore } from '@/stores/user';
import { useSocietyStore } from '@/stores/society';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

import Waiting from '@/components/Waiting.vue';
import ChoiceShow from '@/components/ChoiceShow.vue';

import { useErrorStore } from '@/stores/error.js';

const username = ref('');
const password = ref('');
const userStore = useUserStore();
const societyStore = useSocietyStore();
const errorStore = useErrorStore();
const loginLoading = ref(false);
const [UseTemplate, LoginCard] = createReusableTemplate();

function login() {
  if (!username.value || !password.value) {
    errorStore.add_error('请填写用户名、密码');
    return;
  }
  userStore.login(username.value, password.value);
}

const choice = computed(() => {
  return societyStore.historyChoice;
});

const choices = computed(() => {
  return choice.value?.choices.map(id => societyStore.get_society(id)?.name ?? "未知") ?? ["", "", ""];
})
</script>

<template>
  <div class="flex flex-col gap-y-8 min-h-[70vh] justify-center items-center px-6 py-8">
    <UseTemplate>
      <form @submit.prevent>
        <Card>
          <CardHeader></CardHeader>
          <CardContent class="flex flex-col gap-4">
            <div class="flex flex-col gap-2">
              <div class="flex items-center gap-2">
                <Label for="username" class="text-xl w-24">用户名</Label>
                <Input type="text" name="username" id="username" v-model="username" placeholder="Username"
                  class="bg-amber-100"></Input>
              </div>
              <div class="text-gray-500 font-bold text-right text-sm">9位学号，如320270101。</div>
            </div>
            <div class="flex flex-col gap-2">
              <div class="flex items-center gap-2">
                <Label for="password" class="text-xl w-24">密码</Label>
                <Input type="password" name="password" id="password" v-model="password" placeholder="Password"
                  class="bg-amber-100"></Input>
              </div>
              <div class="text-gray-500 font-bold text-right text-sm">密码为学号后6位@身份证后6位<br>（如有X，要大写），如270101@12345X。</div>
            </div>
          </CardContent>
          <CardFooter class="text-center">
            <Button @click="login" class="login-btn mt-5 relative text-lg w-full bg-amber-500 hover:bg-amber-600">
              登录
            </Button>
          </CardFooter>
        </Card>
      </form>
    </UseTemplate>
    <div class="w-xs shadow-lg rounded-lg border-4" v-if="userStore.token.length === 0">
      <LoginCard></LoginCard>
    </div>
    <div class="w-xs" v-else>
      <div>
        <accordion :collapsible="true">
          <accordion-item value="login">
            <accordion-trigger class="font-bold px-4 py-2 w-full text-center">您已登录，点此展开重新登录。</accordion-trigger>
            <accordion-content>
              <LoginCard></LoginCard>
            </accordion-content>
          </accordion-item>
        </accordion>
      </div>
    </div>
    <div v-if="userStore.userInformation.role === 'student'">
      <p v-if="choice === null">还没有选课记录哦，快去选课吧！</p>
      <div v-else class="flex flex-col gap-3 items-center">
        <ChoiceShow :choice="choices">
          <template #title>
            <div>选课记录</div>
          </template>
          <template #description>
            <div class="flex flex-col px-1 item-center">
              <span>提交时间: {{ choice.updated.format("MM-DD HH:mm:ss.SSS") }}</span>
              <span v-if="choice.ip">
                <span v-if="choice.ip === societyStore.localIP">请求来自本 IP</span>
                <span v-else v-show="false">请求来自 IP {{ choice.ip }}</span>
              </span>
            </div>
          </template>
        </ChoiceShow>
      </div>
    </div>
    <Waiting :show="loginLoading">
      <template #default>正在登录...</template>
    </Waiting>
  </div>
</template>

<style>
@reference "tailwindcss";

.login-btn::before {
  @apply block absolute right-0 bg-contain;
  width: 130px;
  height: 36.5px;
  top: -36.5px;
  transform: rotateY(180deg);
  background-image: url('/img/homepage-bird.jpg');
  content: '';
}
</style>
