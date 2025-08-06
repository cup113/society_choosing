<script setup lang="ts">
import { computed, ref } from 'vue';
import { useUserStore } from '@/stores/user';
import { useSocietyStore } from '@/stores/society';
import Waiting from '@/components/Waiting.vue';
import LoginForm from '@/components/LoginForm.vue';
import LoginStatus from '@/components/LoginStatus.vue';
import ChoiceHistory from '@/components/ChoiceHistory.vue';

const userStore = useUserStore();
const societyStore = useSocietyStore();
const showLogin = ref(false);

const choice = computed(() => {
  return societyStore.historyChoice;
});
</script>

<template>
  <div class="flex flex-col gap-y-8 min-h-[70vh] justify-center items-center px-4 py-8">
    <div class="text-center mb-4">
      <h1 class="text-3xl md:text-4xl font-bold text-amber-800 mb-2">华二宝山社团选课系统</h1>
      <p class="text-amber-600">欢迎使用社团选课系统，请登录后进行选课操作</p>
    </div>

    <LoginStatus v-if="userStore.token.length !== 0" v-model:show-login="showLogin">
      <template #default>
        <LoginForm></LoginForm>
      </template>
    </LoginStatus>
    <LoginForm v-else></LoginForm>

    <div v-if="userStore.userInformation.role === 'student' && userStore.token" class="w-full max-w-md">
      <div v-if="choice === null" class="text-center py-8 bg-amber-50 rounded-lg border-2 border-amber-200">
        <p class="text-amber-700 text-lg font-medium">还没有选课记录哦，快去选课吧！</p>
        <router-link to="/choose"
          class="inline-block mt-4 px-6 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors font-medium">
          前往选课
        </router-link>
      </div>
      <ChoiceHistory v-else :choice="choice" />
    </div>

    <Waiting :show="userStore.loginLoading">
      <template #default>正在登录...</template>
    </Waiting>
  </div>
</template>
