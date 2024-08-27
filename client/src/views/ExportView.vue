<script lang="ts" setup>
import Button from '@/components/ui/button/Button.vue';
import { Fetcher } from '@/lib/fetch';
import { useErrorStore } from '@/stores/error';

const errorStore = useErrorStore();

function export_data() {
  new Fetcher({
    url: "/api/export/choosing",
    method: "POST",
  }).fetch_blob().then(blob => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "社团选课数据导出.zip";
    a.click();
  }).catch(error => {
    console.log(error);
    errorStore.add_error(`导出数据失败: ${error.toString()}`)
  });
}
</script>

<template>
  <div class="text-center">
    <Button @click="export_data" class="text-xl">导出数据</Button>
  </div>
</template>
