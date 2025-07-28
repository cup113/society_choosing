import { defineStore } from 'pinia';
import { useLocalStorage } from '@vueuse/core';

export interface Batch {
  name: string;
  index: 0 | 1 | 2;
}

export const useUserStore = defineStore('user', () => {
  const userID = useLocalStorage('SC_userID', '');
  const token = useLocalStorage('SC_token', '');
  const userInformation = useLocalStorage('SC_userInformation', {
    name: '',
    role: '',
    username: '',
  });
  const favorites = useLocalStorage('SC_favorites', new Array<string>());
  const choices = useLocalStorage('SC_choice_v4', [undefined, undefined, undefined] as [string | undefined, string | undefined, string | undefined]);
  const answer = useLocalStorage('SC_answer', '');
  const batches: Batch[] = [
    { 'name': '第一志愿', 'index': 0 },
    { 'name': '第二志愿', 'index': 1 },
    { 'name': '第三志愿', 'index': 2 },
  ];

  return { userID, token, userInformation, choices, favorites, answer, batches }
})
