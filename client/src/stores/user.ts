import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useLocalStorage } from '@vueuse/core';
import { useSocietyStore } from './society';
import { useErrorStore } from './error';
import { Fetcher } from '@/lib/fetch';
import { convert_password_compatible } from '@/lib/utils';
import type { UsersRoleOptions, LoginResponse } from '@/../../types/types';
import router from '@/router';

export interface Batch {
  name: string;
  index: 0 | 1 | 2;
}

export const useUserStore = defineStore('user', () => {
  const userID = useLocalStorage('SC_userID', '');
  const token = useLocalStorage('SC_token', '');
  const userInformation = useLocalStorage('SC_userInformation', {
    name: '',
    role: '' as UsersRoleOptions | '',
    username: '',
  });
  const favorites = useLocalStorage('SC_favorites', new Array<string>());
  const choices = useLocalStorage('SC_choice_v4', [undefined, undefined, undefined] as [string | undefined, string | undefined, string | undefined]);
  const loginLoading = ref(false);
  const answer = useLocalStorage('SC_answer', '');
  const batches: Batch[] = [
    { 'name': '第一志愿', 'index': 0 },
    { 'name': '第二志愿', 'index': 1 },
    { 'name': '第三志愿', 'index': 2 },
  ];

  function login(username: string, password: string, altchaPayload: string) {
    loginLoading.value = true;
    const data = {
      username,
      password: convert_password_compatible(password),
      altcha: altchaPayload,
    };
    new Fetcher<LoginResponse>({
      url: '/api/login',
      method: 'POST',
      data: JSON.stringify(data),
    }).fetch_json().then(data => {
      const societyStore = useSocietyStore();
      userID.value = data.userID;
      token.value = data.token;
      userInformation.value = data.userInformation;
      societyStore.refresh_society_history();
      router.push(userInformation.value.role === 'student' ? '/choose' : '/admin');
      societyStore.refresh();
      loginLoading.value = false;
    }).catch(error => {
      const errorStore = useErrorStore();
      loginLoading.value = false;
      console.error(error);
      errorStore.add_error(`登录失败，请按照输入框下的提示检查用户名和密码是否正确：${error.toString()}`);
    });
  }

  return { userID, token, userInformation, choices, favorites, answer, batches, loginLoading, login };
})
