<script setup lang="ts">
import { ref } from 'vue';
import { useElementSize } from '@vueuse/core';

import { useUserStore } from '@/stores/user';
import router from '../router';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';

const username = ref('');
const password = ref('');
const store = useUserStore();
const form_el = ref(null as HTMLFormElement | null);
const { width } = useElementSize(form_el);

function login() {
  const data = {
    username: username.value,
    password: password.value,
  };
  fetch('/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  }).then(response => response.json()).then(data => {
    store.userID = data.userID;
    store.token = data.token;
    store.userInformation = data.userInformation;
    router.push(store.userInformation.role === 'student' ? '/choose' : '/export');
  });
}
</script>

<template>
  <div class="flex flex-col gap-y-8 min-h-[70vh] justify-center px-6">
    <form @submit.prevent class="max-w-96 flex mx-auto flex-col gap-8" ref="form_el">
      <Card class="shadow-lg border-4">
        <CardHeader></CardHeader>
        <CardContent class="flex flex-col gap-4">
          <div class="flex items-center gap-2">
            <Label for="username" class="text-xl w-24">用户名</Label>
            <Input type="text" name="username" id="username" v-model="username" placeholder="Username" class="bg-cream"></Input>
          </div>
          <div class="flex items-center gap-2">
            <Label for="password" class="text-xl w-24">密码</Label>
            <Input type="password" name="password" id="password" v-model="password" placeholder="Password" class="bg-cream"></Input>
          </div>
        </CardContent>
        <CardFooter class="text-center">
          <Button @click="login" class="login-btn mt-3 relative text-lg w-full bg-amber-500 hover:bg-amber-600">登录</Button>
        </CardFooter>
      </Card>
    </form>
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
