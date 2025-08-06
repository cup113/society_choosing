<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { useAdminStore } from '@/stores/admin'
import UserIcon from '@/components/icon/UserIcon.vue'
import TickIcon from '@/components/icon/TickIcon.vue'
import DeleteIcon from '@/components/icon/DeleteIcon.vue'

const adminStore = useAdminStore()
const userImportData = ref('')
const userDeleteClass = ref('')

onMounted(() => {
  adminStore.getUsers()
})
</script>

<template>
  <Card class="w-full shadow-md bg-amber-100">
    <CardHeader class="rounded-t-lg">
      <CardTitle class="text-amber-800 flex items-center gap-1">
        <UserIcon />
        用户管理
      </CardTitle>
      <CardDescription>
        从 Excel 批量导入用户；按班级批量删除用户
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div class="flex flex-col gap-8">
        <section class="space-y-4 shadow-lg">
          <div class="bg-amber-50 p-4 rounded-lg">
            <h3 class="font-semibold text-amber-700 mb-2">批量导入用户</h3>
            <p class="text-sm text-gray-600 mb-3">从 Excel 文件复制后粘贴到以下输入框。表头：班级、学号、密码、姓名、性别、角色。</p>
            <Textarea v-model="userImportData" class="min-h-[120px] mb-3" placeholder="粘贴用户数据..." />
            <Button @click="adminStore.importUsers(userImportData)" class="bg-amber-600 hover:bg-amber-700">
              <TickIcon />
              导入用户
            </Button>
          </div>
        </section>
        <section class="space-y-4 shadow-lg">
          <div class="bg-amber-50 p-4 rounded-lg">
            <h3 class="font-semibold text-amber-700 mb-2">批量删除用户</h3>
            <p class="text-sm text-gray-600 mb-3">请选择需要删除的班级的学生</p>
            <div class="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div class="w-full">
                <Select v-model="userDeleteClass">
                  <SelectTrigger class="w-full">
                    <SelectValue placeholder="请选择班级" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem v-for="class_ in adminStore.getClasses()" :key="class_.name" :value="class_.name">
                      {{ class_.name }} ({{ class_.count }} 人)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button variant="destructive" @click="adminStore.deleteUsers(userDeleteClass)" class="w-full sm:w-auto">
                <DeleteIcon />
                删除用户
              </Button>
            </div>
          </div>
        </section>
      </div>
    </CardContent>
    <CardFooter class="font-bold" v-show="adminStore.userSuccessHint">
      <p class="text-green-600">{{ adminStore.userSuccessHint }}</p>
    </CardFooter>
  </Card>
</template>
