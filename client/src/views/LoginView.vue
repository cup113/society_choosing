<script setup lang="ts">
import { ref } from 'vue';
import { useUserStore } from '@/stores/user';
import router from '../router';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';

const username = ref('');
const password = ref('');
const store = useUserStore();

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
    router.push('/');
  });
}
</script>

<template>
  <div>
    <form @submit.prevent class="max-w-96 flex mx-auto flex-col gap-4">
      <Card>
        <CardHeader>
          <h1 class="text-center font-bold text-3xl">登录</h1>
        </CardHeader>
        <CardContent>
          <div class="flex">
            <Label for="username" class="text-xl w-24">用户名</Label>
            <Input type="text" name="username" id="username" v-model="username" placeholder="Username"></Input>
            <!--TODO default hint-->
          </div>
          <div class="flex">
            <Label for="password" class="text-xl w-24">密码</Label>
            <Input type="password" name="password" id="password" v-model="password" placeholder="Password"></Input>
          </div>
        </CardContent>
        <CardFooter>
          <Button @click="login" class="text-lg">登录</Button>
        </CardFooter>
      </Card>
    </form>
  </div>
</template>

<style></style>
