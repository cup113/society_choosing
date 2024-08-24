import { defineStore } from "pinia";
import { ref, reactive } from "vue";
import { useUserStore } from "./user";
import { custom_fetch, json_response } from "@/lib/fetch";

export interface Society {
  id: string;
  index: string;
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

  const timeStatus = ref<{ open: true } | { open: false, estimated: Date } | null>(null);

  const societyDone = json_response(custom_fetch({
    url: '/api/societies/list',
    method: 'GET',
  })).then(data => {
    societies.value = data.societies.map((society: Omit<Society, 'index'>, index: number) => {
      return {
        ...society,
        index: (index + 1 < 10 ? '0' : '') + (index + 1).toString(),
      };
    });
    if (data.timeStatus.open) {
      timeStatus.value = { open: true };
    } else {
      timeStatus.value = { open: false, estimated: new Date(Date.now() + data.timeStatus.eta) };
    }
  });

  function refresh_society_history() {
    json_response(custom_fetch({
      'url': '/api/history',
      'method': 'GET',
    })).then((data: {
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
    if (userStore.token.length !== 0) {
      refresh_society_history();
    }
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
    timeStatus,
    get_society,
    get_society_id,
    refresh_society_history,
  }
});
