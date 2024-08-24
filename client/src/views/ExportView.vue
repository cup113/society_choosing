<script lang="ts" setup>
import Button from '@/components/ui/button/Button.vue';
import { custom_fetch, blob_response } from '@/lib/fetch';

function export_data() {
  blob_response(custom_fetch({
    url: "/api/export/choosing",
    method: "POST",
  })).then(blob => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "社团选课数据导出.zip";
    a.click();
  });
}
</script>

<template>
  <div class="text-center">
    <Button @click="export_data" class="text-xl">导出数据</Button>
  </div>
</template>
