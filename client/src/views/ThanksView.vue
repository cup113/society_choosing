<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircleIcon, ArrowLeftIcon, TimerIcon } from 'lucide-vue-next';

const router = useRouter();
const countdown = ref(5);

let timer: number | null = null;

onMounted(() => {
  timer = window.setInterval(() => {
    countdown.value--;
    if (countdown.value <= 0) {
      router.replace('/');
    }
  }, 1000);
});

onBeforeUnmount(() => {
  if (timer) {
    clearInterval(timer);
  }
});

function goHome() {
  router.replace('/');
}
</script>


<template>
  <div
    class="flex flex-col min-h-[70vh] gap-8 py-8 items-center justify-center bg-gradient-to-br from-amber-50 to-stone-100 dark:from-stone-900 dark:to-stone-950">
    <Card
      class="w-full max-w-md border-2 border-amber-300 shadow-card bg-gradient-to-br from-white to-amber-50 dark:from-stone-800 dark:to-stone-900 rounded-xl">
      <CardHeader class="text-center pb-4">
        <div class="flex justify-center mb-4">
          <div class="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircleIcon class="w-12 h-12 text-green-600" />
          </div>
        </div>
        <h1 class="text-3xl font-bold text-amber-800 dark:text-amber-200">提交成功</h1>
      </CardHeader>
      <CardContent class="text-center pb-6">
        <p class="text-lg text-gray-700 dark:text-gray-300 mb-6">
          您的选课报名已成功提交！
        </p>
        <div class="flex justify-center mb-6">
          <img src="/img/thanks-bird.jpg" alt="感谢鸟" class="w-40 h-40 rounded-2xl shadow-lg">
        </div>
        <div class="flex items-center justify-center gap-2 mb-6 p-3 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
          <TimerIcon class="w-5 h-5 text-amber-700 dark:text-amber-300" />
          <span class="text-amber-700 dark:text-amber-300">
            {{ countdown }} 秒后自动跳转回主页
          </span>
        </div>
        <Button @click="goHome" class="w-full gradient-amber-btn py-6 text-lg font-bold hover-lift">
          <ArrowLeftIcon class="w-5 h-5 mr-2" />
          立即返回主页
        </Button>
      </CardContent>
    </Card>

    <div class="text-center text-gray-600 dark:text-gray-400 mt-4">
      <p>如有问题，请联系管理员</p>
    </div>
  </div>
</template>
