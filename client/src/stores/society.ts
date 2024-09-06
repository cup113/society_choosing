import { defineStore } from "pinia";
import { ref, reactive, computed } from "vue";
import { createShuffle } from 'fast-shuffle';
import { alea } from 'seedrandom';

import { useUserStore } from "./user";
import { useErrorStore } from "./error";
import { Fetcher } from "@/lib/fetch";
import type { ListHistoryResponse, ListSocietyResponse, Society as _Society } from "../../../types/types.d.ts";

export type Society = _Society & { index: string, isCoreMember: boolean };

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

  const localIP = ref("");

  async function refresh_society_basic() {
    return new Fetcher<ListSocietyResponse>({
      url: '/api/societies/list',
      method: 'GET',
    }).fetch_json().then(data => {
      const userID = useUserStore().userID;
      const societiesData = data.societies.map((society: Omit<Society, 'index' | 'isCoreMember'>, index: number) => {
        return {
          ...society,
          isCoreMember: society.coreMembers?.includes(userID) ?? false,
        };
      });
      societies.value = createShuffle(alea(userID).int32(), societiesData).sort((a, b) => {
        return a.isCoreMember ? 0 : 1 - (b.isCoreMember ? 0 : 1);
      }).map((society, index) => {
        return {
          ...society,
          index: (index < 9 ? '0' : '') + (index + 1).toString(),
        }
      });
      if (data.timeStatus.open) {
        timeStatus.value = { open: true };
      } else {
        timeStatus.value = { open: false, estimated: new Date(Date.now() + data.timeStatus.eta) };
      }
      localIP.value = data.ip ?? "";
    }).catch(error => {
      const errorStore = useErrorStore();
      console.error(error);
      errorStore.add_error(`获取社团失败，请稍后再试或联系管理员: ${error.toString()}`);
    });
  }

  function refresh_society_history() {
    new Fetcher<ListHistoryResponse>({
      'url': '/api/history',
      'method': 'GET',
    }).fetch_json().then((data) => {
      historyChoices.count = data.totalItems;
      historyChoices.choices = data.items.map(item => {
        let ip = item.ip ? (item.ip.length > 0 ? item.ip : undefined) : undefined;
        if (ip !== undefined && ip.startsWith("::ffff:")) {
          ip = ip.slice(7);
        }
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

  function refresh() {
    refresh_society_basic().then(() => {
      const userStore = useUserStore();
      if (userStore.token.length !== 0) {
        refresh_society_history();
      }
    });
  }

  refresh();

  const get_society = (id: string) => {
    return societies.value.find(society => society.id === id);
  }

  const get_society_id = (name: string) => {
    return societies.value.find(society => society.name === name)?.id;
  }

  const question = computed(() => {
    const userStore = useUserStore();
    return userStore.batches.map(batch => {
      const society = get_society(userStore.choice[batch.key] ?? '');
      const q = society?.question;
      if (!q) {
        return false;
      } else {
        return `(来自${society.name}) ${q}`
      }
    }).filter(Boolean).join('；');
  });

  return {
    societies,
    historyChoices,
    timeStatus,
    localIP,
    question,
    get_society,
    get_society_id,
    refresh,
    refresh_society_history,
  }
});
