import { defineStore } from "pinia";
import { ref } from "vue";

export const useErrorStore = defineStore("error", () => {
    const errorMessages = ref(new Array<string>());
    const errorWindowOpen = ref(false);

    function add_error(...messages: string[]): void {
        errorMessages.value.push(...messages);
        errorWindowOpen.value = true;
    }

    function clear_error(): void {
        errorMessages.value.splice(0, errorMessages.value.length);
        errorWindowOpen.value = false;
    }

    return {
        errorMessages,
        errorWindowOpen,
        add_error,
        clear_error,
    }
});