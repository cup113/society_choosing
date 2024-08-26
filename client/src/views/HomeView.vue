<script setup lang="ts">
import { ref } from 'vue';
import { createReusableTemplate } from '@vueuse/core';

import { useUserStore } from '@/stores/user';
import { useSocietyStore } from '@/stores/society';
import router from '@/router';
import { json_response, custom_fetch } from '@/lib/fetch';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible'

import Waiting from '@/components/Waiting.vue';

const username = ref('');
const password = ref('');
const userStore = useUserStore();
const societyStore = useSocietyStore();
const loginLoading = ref(false);
const [UseTemplate, LoginCard] = createReusableTemplate();

function login() {
  loginLoading.value = true;
  const data = {
    username: username.value,
    password: password.value,
  };
  json_response(custom_fetch({
    url: '/api/login',
    method: 'POST',
    data: JSON.stringify(data),
  })).then(data => {
    userStore.userID = data.userID;
    userStore.token = data.token;
    userStore.userInformation = data.userInformation;
    societyStore.refresh_society_history();
    router.push(userStore.userInformation.role === 'student' ? '/choose' : '/export');
  }).catch(error => {
    console.error(error);
    alert(error.message);
  });
}
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
                  class="bg-cream"></Input>
              </div>
              <div class="text-gray-500 font-bold text-right text-sm">9位学号，如320270501。</div>
            </div>
            <div class="flex flex-col gap-2">
              <div class="flex items-center gap-2">
                <Label for="password" class="text-xl w-24">密码</Label>
                <Input type="password" name="password" id="password" v-model="password" placeholder="Password"
                  class="bg-cream"></Input>
              </div>
              <div class="text-gray-500 font-bold text-right text-sm">密码为学号后6位@身份证后6位<br>（如有X，要大写），如270501@12345X</div>
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
    <div class="max-w-96 flex flex-col gap-8 shadow-lg border-4">
      <LoginCard v-if="userStore.token.length === 0"></LoginCard>
      <div v-else>
        <Collapsible :default-open="false">
          <CollapsibleTrigger class="font-bold text-center px-4 py-2">您已登录，点此展开重新登录。</CollapsibleTrigger>
          <CollapsibleContent>
            <LoginCard></LoginCard>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
    <div>
      <p v-if="societyStore.historyChoices.count === 0">还没有选课记录哦，快去选课吧！</p>
      <div v-else class="flex flex-col gap-3">
        <div class="text-xl">选课次数：{{ societyStore.historyChoices.count }}</div>
        <ul class="flex flex-col gap-2">
          <li v-for="choice, index in societyStore.historyChoices.choices" :key="choice.id" class="flex flex-col gap-1">
            <span>最近第 {{ index + 1 }} 次选课（{{ new Date(choice.created).toLocaleString() }}, IP {{ choice.ip ?? '未知'
              }}）</span>
            <span class="flex flex-col gap-1 pl-8">
              <span>第一志愿：{{ choice.first_choice }}</span>
              <span>第二志愿：{{ choice.second_choice }}</span>
              <span>第三志愿：{{ choice.third_choice }}</span>
            </span>
          </li>
        </ul>
      </div>
    </div>
    <Waiting :show="loginLoading">
      <template #default>正在登录...</template>
    </Waiting>
  </div>
</template>

<style>
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
