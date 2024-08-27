import { defineStore } from "pinia";
import { ref, reactive } from "vue";
import { useUserStore } from "./user";
import { useErrorStore } from "./error";
import { Fetcher } from "@/lib/fetch";
import type { ListHistoryResponse, ListSocietyResponse, Society as _Society } from "../../../types/types.d.ts";

export type Society = _Society & { index: string };

export const useSocietyStore = defineStore('society', () => {
  const societies = ref(new Array<Society>());

  const historyChoices = reactive({
    count: 0,
    choices: new Array<{
      id: string;
      ip?: string;
      created: Date;
      first_choice?: string;
      second_choice?: string;
      third_choice?: string;
    }>(),
  });

  const timeStatus = ref<{ open: true } | { open: false, estimated: Date } | null>(null);

  const societyDone = new Fetcher<ListSocietyResponse>({
    url: '/api/societies/list',
    method: 'GET',
  }).fetch_json().then(data => {
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
  }).catch(error => {
    const errorStore = useErrorStore();
    console.error(error);
    errorStore.add_error(`获取社团失败，请稍后再试或联系管理员: ${error.toString()}`);
  });

  function refresh_society_history() {
    new Fetcher<ListHistoryResponse>({
      'url': '/api/history',
      'method': 'GET',
    }).fetch_json().then((data) => {
      historyChoices.count = data.totalItems;
      historyChoices.choices = data.items.map(item => {
        const ip = item.ip ? (item.ip.length > 0 ? item.ip : undefined) : undefined;
        return {
          first_choice: get_society(item.first_choice)?.name,
          second_choice: get_society(item.second_choice)?.name,
          third_choice: get_society(item.third_choice)?.name,
          created: new Date(item.created),
          id: item.id,
          ip,
        }
      });
    }).catch(error => {
      const errorStore = useErrorStore();
      console.error(error);
      errorStore.add_error(`获取历史记录失败，请稍后再试或联系管理员: ${error.toString()}`);
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
