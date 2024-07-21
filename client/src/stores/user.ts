import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { useLocalStorage } from '@vueuse/core';

export const useUserStore = defineStore('user', () => {
  const userID = useLocalStorage('SC_userID', '');
  const token = useLocalStorage('SC_token', '');
  const choice = useLocalStorage('SC_choice', {} as Record<string, string>);

  return { userID, token, choice }
})
