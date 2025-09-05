<script lang="ts" setup>
import { RouterView, useRouter, useRoute } from 'vue-router'
import { onMounted, ref, watch } from 'vue'
import { Button } from '@/components/ui/button'
import { UserIcon, CalendarIcon, GroupIcon, FileTextIcon } from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()
const activeTab = ref('users')

watch(
  () => route.name,
  (newRouteName) => {
    switch (newRouteName) {
      case 'UserManagement':
        activeTab.value = 'users'
        break
      case 'DateManagement':
        activeTab.value = 'dates'
        break
      case 'SocietyManagement':
        activeTab.value = 'societies'
        break
      case 'ChoiceManagement':
        activeTab.value = 'choices'
        break
      default:
        activeTab.value = 'users'
    }
  },
  { immediate: true }
)

onMounted(() => {
  switch (route.name) {
    case 'UserManagement':
      activeTab.value = 'users'
      break
    case 'DateManagement':
      activeTab.value = 'dates'
      break
    case 'SocietyManagement':
      activeTab.value = 'societies'
      break
    case 'ChoiceManagement':
      activeTab.value = 'choices'
      break
    default:
      activeTab.value = 'users'
  }
})

function navigateTo(tab: string) {
  activeTab.value = tab
  switch (tab) {
    case 'users':
      router.push({ name: 'UserManagement' })
      break
    case 'dates':
      router.push({ name: 'DateManagement' })
      break
    case 'societies':
      router.push({ name: 'SocietyManagement' })
      break
    case 'choices':
      router.push({ name: 'ChoiceManagement' })
      break
  }
}
</script>

<template>
  <main class="flex flex-col w-full max-w-4xl mx-auto py-6">
    <div class="text-center mb-2">
      <h1 class="text-3xl font-bold text-amber-800">管理系统</h1>
      <p class="text-amber-600">管理用户、选课活动和社团信息</p>
    </div>

    <!-- 导航标签 -->
    <div class="flex justify-center bg-amber-200 p-1 rounded-t-lg shadow-md mt-2">
      <Button @click="navigateTo('users')" :variant="activeTab === 'users' ? 'default' : 'ghost'"
        class="flex items-center gap-2"
        :class="{ 'bg-amber-600 text-white hover:bg-amber-700': activeTab === 'users' }">
        <UserIcon class="w-5 h-5" />
        用户管理
      </Button>
      <Button @click="navigateTo('dates')" :variant="activeTab === 'dates' ? 'default' : 'ghost'"
        class="flex items-center gap-2"
        :class="{ 'bg-amber-600 text-white hover:bg-amber-700': activeTab === 'dates' }">
        <CalendarIcon class="w-5 h-5" />
        选课管理
      </Button>
      <Button @click="navigateTo('societies')" :variant="activeTab === 'societies' ? 'default' : 'ghost'"
        class="flex items-center gap-2"
        :class="{ 'bg-amber-600 text-white hover:bg-amber-700': activeTab === 'societies' }">
        <GroupIcon class="w-5 h-5" />
        社团管理
      </Button>
      <Button @click="navigateTo('choices')" :variant="activeTab === 'choices' ? 'default' : 'ghost'"
        class="flex items-center gap-2"
        :class="{ 'bg-amber-600 text-white hover:bg-amber-700': activeTab === 'choices' }">
        <FileTextIcon class="w-5 h-5" />
        选课记录
      </Button>
    </div>

    <RouterView v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </RouterView>
  </main>
</template>
