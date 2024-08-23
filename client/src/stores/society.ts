import { defineStore } from "pinia";
import { ref } from "vue";

export interface Society {
  id: string;
  name: string;
  cap: number;
}

export const useSocietyStore = defineStore('society', () => {
  const societies = ref(new Array<Society>());
  fetch('/api/societies/list').then(response => response.json()).then(data => {
    societies.value = data;
  });

  const get_society = (id: string) => {
    return societies.value.find(society => society.id === id);
  }

  const get_society_id = (name: string) => {
    return societies.value.find(society => society.name === name)?.id;
  }

  return {
    societies,
    get_society,
    get_society_id,
  }
});
