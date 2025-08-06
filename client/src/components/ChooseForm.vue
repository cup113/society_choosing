<script setup lang="ts">
import { computed } from 'vue';
import ChoiceComboBox from '@/components/ChoiceComboBox.vue';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useUserStore } from '@/stores/user';
import { useSocietyStore } from '@/stores/society';
import { CalendarIcon, AlertTriangleIcon, CheckIcon, HelpCircleIcon } from 'lucide-vue-next';

const userStore = useUserStore();
const societyStore = useSocietyStore();

defineProps<{
  onSubmit: () => void;
}>();

const canSubmit = computed(() => {
  return societyStore.timeStatus?.open && !societyStore.coreMemberOf;
});
</script>

<template>
  <div
    class="fixed bottom-0 left-0 right-0 border-t-4 border-amber-600 shadow-2xl bg-gradient-to-r from-amber-50 to-amber-100 w-full flex flex-col items-center pt-5 pb-6 z-10 max-h-100 overflow-y-auto">
    <div class="w-full max-w-7xl px-4">
      <div class="flex flex-col lg:flex-row items-center justify-between gap-4">
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full lg:w-auto">
          <ChoiceComboBox v-for="batch in userStore.batches" :key="batch.name" :batch="batch"
            class="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow" />
        </div>

        <Button v-if="canSubmit" @click="onSubmit"
          class="submit-btn relative w-32 h-14 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold text-lg rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2">
          <CalendarIcon class="w-5 h-5" />
          <span>提交选课</span>
        </Button>

        <div v-else-if="societyStore.coreMemberOf"
          class="flex items-center gap-2 bg-green-200 text-green-800 px-4 py-3 rounded-xl">
          <CheckIcon class="w-5 h-5" />
          <span>核心成员无需选课</span>
        </div>

        <div v-else-if="!societyStore.timeStatus?.open"
          class="flex items-center gap-2 bg-amber-200 text-amber-800 px-4 py-3 rounded-xl">
          <AlertTriangleIcon class="w-5 h-5" />
          <span>选课未开放</span>
        </div>
      </div>

      <div v-if="societyStore.questions.length > 0"
        class="mt-5 flex flex-col items-center md:flex-row gap-4 bg-white p-4 rounded-xl border-2 border-amber-200 shadow-sm">
        <div class="flex-1">
          <div class="flex items-center gap-2 mb-2">
            <HelpCircleIcon class="w-5 h-5 text-amber-600" />
            <p class="font-bold text-amber-800">附加问题：</p>
          </div>
          <p class="text-gray-700 bg-amber-50 p-3 rounded-lg">{{ societyStore.questions }}</p>
        </div>
        <Textarea
          class="w-full md:w-80 bg-white border-2 border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          v-model="userStore.answer" placeholder="请输入答案..." />
      </div>
    </div>
  </div>
</template>

<style scoped>
.submit-btn::before {
  position: absolute;
  right: -10px;
  width: 50px;
  height: 35px;
  top: -40px;
  content: "";
  background-image: url('/img/button-bird.png');
  background-size: contain;
  background-repeat: no-repeat;
}
</style>
