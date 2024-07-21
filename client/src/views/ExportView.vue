<script lang="ts" setup>
import { useUserStore } from '@/stores/user';
import Button from '@/components/ui/button/Button.vue';

const store = useUserStore();
function export_data() {
  fetch("/api/export/choosing", {
    method: "POST",
    body: JSON.stringify({ token: store.token }),
    headers: {
      "Content-Type": "application/json",
    },
  }).then(response => {
    response.blob().then(blob => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "社团选课数据导出.zip";
      a.click();
    })
  });
}
</script>

<template>
  <div class="text-center">
    <Button @click="export_data" class="text-xl">导出数据</Button>
  </div>
</template>
