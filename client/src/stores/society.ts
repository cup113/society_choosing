import { defineStore } from "pinia";
import { ref, reactive, computed, nextTick } from "vue";
import { createShuffle } from 'fast-shuffle';
import { alea } from 'seedrandom';
import { useLocalStorage } from "@vueuse/core";
import dayjs from "dayjs";

import { useUserStore } from "./user";
import { useErrorStore } from "./error";
import { useTimeStore } from "./time";
import { Fetcher } from "@/lib/fetch";
import type { HistoryChoiceResponse, Choice as _Choice, ListSocietyResponse, Society as _Society } from "../../../types/types.d.ts";


export type Society = _Society & { index: string };

type Choice = Omit<_Choice, "created" | "updated"> & { updated: dayjs.Dayjs }

export const useSocietyStore = defineStore('society', () => {
  const societies = ref(new Array<Society>());
  const coreMemberOf = ref<string | null>(null)
  const historyChoice = ref<Choice | null>(null);

  const laidEggs = useLocalStorage<number[]>('SC_laid_eggs', []);

  const hen = reactive({ x: 0, y: 0, deg: 0 });


  const timeStatus = ref<{
    open: true,
    estimatedMaintain?: dayjs.Dayjs,
    estimatedEnd: dayjs.Dayjs,
  } | ({ open: false } & ({
    reason: 'not-started',
    estimated: dayjs.Dayjs,
  } | { reason: 'ended' } | { reason: 'no-activity' })) | null>(null);

  const localIP = ref("");

  async function refresh_society_basic() {
    return new Fetcher<ListSocietyResponse>({
      url: '/api/societies/list',
      method: 'GET',
    }).fetch_json().then(data => {
      const userID = useUserStore().userID;
      data.societies.filter(society => society.coreMembers?.includes(userID)).forEach(society => {
        coreMemberOf.value = society.name;
      })
      societies.value = createShuffle(alea(userID).int32(), data.societies).map((society, index) => {
        return {
          ...society,
          index: (index < 9 ? '0' : '') + (index + 1).toString(),
        }
      });
      if (data.timeStatus !== null) {
        if (data.timeStatus.open) {
          timeStatus.value = {
            open: true,
            estimatedEnd: dayjs().add(data.timeStatus.endEta)
          };
        } else {
          if (data.timeStatus.reason === 'not-started') {
            timeStatus.value = { open: false, reason: 'not-started', estimated: dayjs().add(data.timeStatus.eta) };
          } else {
            timeStatus.value = { open: false, reason: data.timeStatus.reason };
          }
        }
      } else {
        timeStatus.value = { open: false, reason: 'no-activity' }
      }
      localIP.value = data.ip ?? "";
    }).catch(error => {
      const errorStore = useErrorStore();
      console.error(error);
      errorStore.add_error(`获取社团失败，请稍后再试或联系管理员: ${error.toString()}`);
    });
  }

  function refresh_society_history() {
    new Fetcher<HistoryChoiceResponse>({
      'url': '/api/choose',
      'method': 'GET',
    }).fetch_json().then((data) => {
      if (data.result === null) {
        historyChoice.value = null;
      } else {
        const { ip: _ip } = data.result;
        let ip = _ip ? (_ip.length > 0 ? _ip : undefined) : undefined;

        if (ip !== undefined && ip.startsWith("::ffff:")) {
          ip = ip.slice("::ffff:".length);
        }
        historyChoice.value = {
          ...data.result,
          updated: dayjs(data.result.created),
          ip,
        }
      }
    }).catch(error => {
      const errorStore = useErrorStore();
      console.error(error);
      errorStore.add_error(`获取历史记录失败，请尝试关闭此窗口后重新登录: ${error.toString()}`);
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

  nextTick(() => {
    const userStore = useUserStore();
    if (userStore.userInformation.role === 'student') {
      refresh();
    }
  })

  const get_society = (id: string) => {
    return societies.value.find(society => society.id === id);
  }

  const get_society_id = (name: string) => {
    return societies.value.find(society => society.name === name)?.id;
  }

  const questions = computed(() => {
    const userStore = useUserStore();
    let result = "";
    userStore.choices.filter(choice => choice !== undefined).forEach(choice => {
      const society = get_society(choice);
      const question = society?.question;
      if (question) {
        result += `【${society.name}】${society.question}`;
      }
    });
    return result;
  });

  const shouldSkipAnimation = computed(() => {
    if (!timeStatus.value || timeStatus.value.open) return false;

    if (timeStatus.value.reason === 'not-started') {
      const remainingSocieties = societies.value.length - laidEggs.value.length;
      const remainingEggTime = remainingSocieties * 2;

      const timeStore = useTimeStore();

      const timeToStart = timeStatus.value.estimated.diff(timeStore.now, 'second');
      return (timeToStart - 2 * remainingEggTime) < 5;
    }

    return false;
  });

  return {
    societies,
    historyChoice,
    timeStatus,
    localIP,
    questions,
    coreMemberOf,
    get_society,
    get_society_id,
    refresh,
    refresh_society_history,

    laidEggs,
    hen,
    shouldSkipAnimation,
  }
});
