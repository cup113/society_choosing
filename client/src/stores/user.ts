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
  const choice = useLocalStorage('SC_choice_v2', []);
  const answer = useLocalStorage('SC_answer', '');

  return { userID, token, userInformation, choice, answer }
})
