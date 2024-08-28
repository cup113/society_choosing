import { defineStore } from 'pinia';
import { useLocalStorage } from '@vueuse/core';

export interface Batch {
  name: string;
  key: 'first_choice' | 'second_choice' | 'third_choice';
}

export const useUserStore = defineStore('user', () => {
  const userID = useLocalStorage('SC_userID', '');
  const token = useLocalStorage('SC_token', '');
  const userInformation = useLocalStorage('SC_userInformation', {
    name: '',
    role: '',
    username: '',
  });
  const choice = useLocalStorage('SC_choice', {
    'first_choice': undefined as string | undefined,
    'second_choice': undefined as string | undefined,
    'third_choice': undefined as string | undefined,
  });
  const answer = useLocalStorage('SC_answer', '');

  const batches: Batch[] = [
    {
      name: "第一志愿",
      key: "first_choice",
    },
    {
      name: "第二志愿",
      key: "second_choice",
    },
    {
      name: "第三志愿",
      key: "third_choice",
    }
  ];

  return { userID, token, userInformation, choice, batches, answer }
})
