<script setup lang="ts">
import { ref } from 'vue';

import { useUserStore } from '@/stores/user';
import { useErrorStore } from '@/stores/error';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';

const username = ref('');
const password = ref('');
const userStore = useUserStore();
const errorStore = useErrorStore();

function login() {
  if (!username.value || !password.value) {
    errorStore.add_error('请填写用户名、密码');
    return;
  }
  userStore.login(username.value, password.value);
}

</script>

<template>
  <form @submit.prevent>
    <Card class="border-2 border-amber-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader class="rounded-t-lg">
        <h2 class="text-2xl font-bold text-center text-amber-800">用户登录</h2>
      </CardHeader>
      <CardContent class="flex flex-col gap-5 p-6">
        <div class="flex flex-col gap-2">
          <div class="flex items-center gap-3">
            <Label for="username" class="text-lg font-medium w-24 text-amber-700">用户名</Label>
            <Input type="text" name="username" id="username" v-model="username" placeholder="请输入9位学号"
              class="bg-amber-50 border-amber-300 focus:ring-2 focus:ring-amber-500 focus:border-transparent" />
          </div>
          <p class="text-amber-600 text-sm ml-28 -mt-1">示例：320270101</p>
        </div>

        <div class="flex flex-col gap-2">
          <div class="flex items-center gap-3">
            <Label for="password" class="text-lg font-medium w-24 text-amber-700">密码</Label>
            <Input type="password" name="password" id="password" v-model="password" placeholder="密码规则见下方说明"
              class="bg-amber-50 border-amber-300 focus:ring-2 focus:ring-amber-500 focus:border-transparent" />
          </div>
          <p class="text-amber-600 text-sm ml-28 -mt-1">
            格式：学号后6位@身份证后6位<br>
            示例：270101@12345X（X需大写）
          </p>
        </div>
      </CardContent>
      <CardFooter class="flex justify-center p-6 rounded-b-lg">
        <Button @click="login"
          class="login-btn relative text-lg w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold py-3 rounded-lg transition-all duration-300 transform hover:scale-[1.02] shadow-md">
          登录系统
        </Button>
      </CardFooter>
    </Card>
  </form>
</template>

<style scoped>
@keyframes float {
  0% {
    transform: translateY(0px);
  }

  50% {
    transform: translateY(-5px);
  }

  100% {
    transform: translateY(0px);
  }
}

.login-btn:hover {
  animation: float 2s ease-in-out infinite;
}

.login-btn::before {
  display: block;
  position: absolute;
  right: 0;
  width: 100px;
  height: 28px;
  top: -30px;
  transform: rotateY(180deg);
  background-image: url('/img/homepage-bird.jpg');
  background-size: contain;
  background-repeat: no-repeat;
  content: '';
}
</style>