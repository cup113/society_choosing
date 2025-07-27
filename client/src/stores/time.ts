import { defineStore } from "pinia";
import { useNow } from "@vueuse/core";

export const useTimeStore = defineStore('time', () => {
    const now = useNow({
        interval: 17,
    });

    function formatDuration(ms: number) {
        if (ms < 10000) {
            return `${(ms / 1000).toFixed(2)}秒`
        }
        if (ms < 60000) {
            return `${(ms / 1000).toFixed(0)}秒`
        }
        let sec = Math.floor(ms / 1000);
        let min = Math.floor(sec / 60);
        let hour = Math.floor(min / 60);
        let secStr = (sec % 60).toString().padStart(2, '0');
        let minStr = (min % 60).toString().padStart(2, '0');
        if (ms < 60000 * 60) {
            return `${minStr}:${secStr}`
        }
        return `${hour}:${minStr}:${secStr}`;
    }

    return { now, formatDuration }
})
