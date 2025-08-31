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
    <Card class="card py-0 border-2 border-amber-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader class="card-header rounded-t-lg gradient-amber-title">
        <h2 class="text-2xl text-center">用户登录</h2>
      </CardHeader>
      <CardContent class="card-content flex flex-col gap-5">
        <div class="flex flex-col gap-2">
          <div class="flex items-center gap-3">
            <Label for="username" class="text-lg font-medium w-24 text-amber-primary">用户名</Label>
            <Input type="text" name="username" id="username" v-model="username" placeholder="请输入9位学号"
              class="form-input" />
          </div>
          <p class="text-amber-secondary text-sm ml-28 -mt-1">示例：320270101</p>
        </div>

        <div class="flex flex-col gap-2">
          <div class="flex items-center gap-3">
            <Label for="password" class="text-lg font-medium w-24 text-amber-primary">密码</Label>
            <Input type="password" name="password" id="password" v-model="password" placeholder="密码规则见下方说明"
              class="form-input" />
          </div>
          <p class="text-amber-secondary text-sm ml-28 -mt-1">
            身份证<strong>后 6 位</strong> (若有 X，要大写)
          </p>
        </div>
      </CardContent>
      <CardFooter class="card-footer flex justify-center rounded-b-lg">
        <Button @click="login"
          class="btn gradient-amber-btn relative text-lg w-full py-3 rounded-lg transition-all duration-300 transform hover:scale-[1.02]">
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

.btn:hover {
  animation: float 2s ease-in-out infinite;
}

.btn::before {
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