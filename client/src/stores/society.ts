import { defineStore } from "pinia";
import { ref, reactive } from "vue";
import { useUserStore } from "./user";

export interface Society {
  id: string;
  name: string;
  cap: number;
}

export const useSocietyStore = defineStore('society', () => {
  const societies = ref(new Array<Society>());

  const historyChoices = reactive({
    count: 0,
    choices: new Array<{
      id: string;
      ip?: string;
      created: string;
      first_choice?: string;
      second_choice?: string;
      third_choice?: string;
    }>(),
  });

  const societyDone = fetch('/api/societies/list').then(response => response.json()).then(data => {
    societies.value = data;
  });

  function refresh_society_history() {
    const userStore = useUserStore();

    fetch('/api/history', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: userStore.token,
      }),
    }).then(response => response.json()).then((data: {
      totalItems: number, items: {
        first_choice: string;
        second_choice: string;
        third_choice: string;
        created: string;
        id: string;
        ip: string;
      }[]
    }) => {
      historyChoices.count = data.totalItems;
      historyChoices.choices = data.items.map(item => {
        return {
          first_choice: get_society(item.first_choice)?.name,
          second_choice: get_society(item.second_choice)?.name,
          third_choice: get_society(item.third_choice)?.name,
          created: item.created,
          id: item.id,
          ip: item.ip.length > 0 ? item.ip : undefined,
        }
      });
    });
  }

  societyDone.then(() => {
    const userStore = useUserStore();
    if (userStore.token.length === 0) {
      return;
    }
    refresh_society_history();
  });

  const get_society = (id: string) => {
    return societies.value.find(society => society.id === id);
  }

  const get_society_id = (name: string) => {
    return societies.value.find(society => society.name === name)?.id;
  }

  return {
    societies,
    historyChoices,
    get_society,
    get_society_id,
    refresh_society_history,
  }
});
