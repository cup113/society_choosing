<template>
  <div v-if="visible"
    class="progress-container fixed top-4 right-4 bg-white p-4 rounded-lg shadow-lg border border-gray-200 z-50 min-w-64">
    <h3 class="text-sm font-medium text-gray-900 mb-2">导入进度</h3>

    <div class="progress-bar w-full bg-gray-200 rounded-full h-2 mb-2">
      <div class="progress-fill bg-amber-600 h-2 rounded-full transition-all duration-300"
        :style="{ width: `${progress}%` }"></div>
    </div>

    <div class="progress-text text-xs text-gray-600 mb-2">
      {{ current }}/{{ total }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const visible = ref(false)
const progress = ref(0)
const current = ref(0)
const total = ref(0)
const failed = ref(0)
const failedUsers = ref<string[]>([])

const startProgress = (totalUsers: number) => {
  visible.value = true
  progress.value = 0
  current.value = 0
  total.value = totalUsers
  failed.value = 0
  failedUsers.value = []
}

const updateProgress = (newSuccess: number) => {
  current.value += newSuccess
  progress.value = total.value > 0 ? (current.value / total.value) * 100 : 0
}

const completeProgress = () => {
  // 延迟隐藏，让用户看到完成状态
  setTimeout(() => {
    visible.value = false
  }, 1000)
}

const stopProgress = () => {
  visible.value = false
}

defineExpose({ startProgress, updateProgress, completeProgress, stopProgress })
</script>

<style scoped>
.progress-container {
  backdrop-filter: blur(10px);
}
</style>