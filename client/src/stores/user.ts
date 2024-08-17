import { defineStore } from 'pinia';
import { useLocalStorage } from '@vueuse/core';

export const useUserStore = defineStore('user', () => {
  const userID = useLocalStorage('SC_userID', '');
  const token = useLocalStorage('SC_token', '');
  const userInformation = useLocalStorage('SC_userInformation', {
    name: '',
    role: '',
    username: '',
  });
  const choice = useLocalStorage('SC_choice', {} as Record<string, 'first_choice' | 'second_choice' | 'adjust_prior' | 'default'>);

  return { userID, token, userInformation, choice }
})
