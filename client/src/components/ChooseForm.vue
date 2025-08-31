<script setup lang="ts">
import { computed, ref } from 'vue';
import ChoiceComboBox from '@/components/ChoiceComboBox.vue';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useUserStore } from '@/stores/user';
import { useSocietyStore } from '@/stores/society';
import { CalendarIcon, AlertTriangleIcon, CheckIcon, HelpCircleIcon, ChevronUpIcon, ChevronDownIcon } from 'lucide-vue-next';
import { useMediaQuery } from '@vueuse/core';

const userStore = useUserStore();
const societyStore = useSocietyStore();

const emit = defineEmits<{
  (emit: 'submit'): void;
}>();

const canSubmit = computed(() => {
  return societyStore.timeStatus?.open && !societyStore.coreMemberOf;
});

// 添加展开/收起状态
const isExpanded = ref(true);
const isMobile = useMediaQuery('(max-width: 768px)');
</script>

<template>
  <div class="choose-form fixed bottom-0 left-0 right-0 w-full flex flex-col items-center z-10 max-h-100">
    <Button v-if="isMobile" @click="isExpanded = !isExpanded" variant="outline"
      class="self-center h-5 z-20 bg-amber-600 border-amber-700 hover:bg-amber-700 text-white rounded-t-md rounded-b-none shadow-lg px-2 transition-all duration-300">
      <Transition name="rotate" mode="out-in">
        <ChevronDownIcon v-if="isExpanded" class="w-5 h-5" :key="1" />
        <ChevronUpIcon v-else class="w-5 h-5" :key="2" />
      </Transition>
    </Button>

    <div class="border-t-4 border-amber-600 w-full overflow-hidden"
      :class="isMobile && !isExpanded ? 'shadow-lg' : 'shadow-xl'">
      <div class="bg-gradient-to-r from-amber-50 to-amber-100 w-full"
        :class="isMobile && !isExpanded ? 'pt-0' : 'pt-6'">
        <Transition name="slide" mode="out-in">
          <div v-if="!isMobile || isExpanded" key="expanded" class="pb-6">
            <div class="w-full max-w-7xl px-4">
              <div class="flex flex-col lg:flex-row items-center justify-between gap-4">
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full lg:w-auto">
                  <ChoiceComboBox v-for="batch in userStore.batches" :key="batch.name" :batch="batch"
                    class="bg-white rounded-xl shadow-card hover-shadow" />
                </div>

                <Button v-if="canSubmit" @click="emit('submit')"
                  class="relative w-32 h-14 gradient-amber-btn font-bold text-lg rounded-xl shadow-lg hover-lift flex items-center justify-center gap-2">
                  <CheckIcon class="w-5 h-5" />
                  <span>提交选课</span>
                </Button>

                <div v-else-if="societyStore.coreMemberOf"
                  class="flex items-center gap-2 bg-green-200 text-green-800 px-4 py-3 rounded-xl shadow-card">
                  <CheckIcon class="w-5 h-5" />
                  <span>核心成员无需选课</span>
                </div>

                <div v-else-if="!societyStore.timeStatus?.open"
                  class="flex items-center gap-2 bg-amber-200 text-amber-800 px-4 py-3 rounded-xl shadow-card">
                  <AlertTriangleIcon class="w-5 h-5" />
                  <span>选课未开放</span>
                </div>
              </div>

              <div v-if="societyStore.questions.length > 0"
                class="mt-5 flex flex-col items-center md:flex-row gap-4 bg-white p-4 rounded-xl border-2 border-amber-200 shadow-card">
                <div class="flex-1">
                  <div class="flex items-center gap-2 mb-2">
                    <HelpCircleIcon class="w-5 h-5 text-amber-600" />
                    <p class="font-bold text-amber-800">附加问题：</p>
                  </div>
                  <p class="text-gray-700 bg-amber-50 p-2 rounded-lg">{{ societyStore.questions }}</p>
                </div>
                <Textarea
                  class="w-full md:w-80 bg-white border-2 border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent form-input"
                  v-model="userStore.answer" placeholder="请输入答案..." />
              </div>
            </div>
          </div>

          <!-- 折叠状态下的提示 -->
          <div v-else-if="isMobile && !isExpanded" key="collapsed" class="py-4">
            <div class="w-full max-w-7xl px-4 flex justify-center">
              <Button @click="isExpanded = true"
                class="gradient-amber-btn font-bold rounded-full px-6 py-3 flex items-center gap-2 shadow-md hover-lift">
                <CalendarIcon class="w-5 h-5" />
                <span>展开进行选课</span>
              </Button>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>

<style scoped>
.choose-form::before {
  position: absolute;
  right: 10px;
  width: 50px;
  height: 35px;
  top: -30px;
  content: "";
  background-image: url('/img/button-bird.png');
  background-size: contain;
  background-repeat: no-repeat;
}
</style>
