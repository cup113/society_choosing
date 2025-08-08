<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table'
import { useAdminStore } from '@/stores/admin'
import { CalendarIcon, TrashIcon } from 'lucide-vue-next'
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog'

const adminStore = useAdminStore()
const startDate = ref('')
const endDate = ref('')

onMounted(() => {
  adminStore.getChoices()
})
</script>

<template>
  <Card class="w-full shadow-md bg-amber-100">
    <CardHeader class="rounded-t-lg">
      <CardTitle class="text-amber-800 flex items-center gap-1">
        <CalendarIcon />
        选课记录管理
      </CardTitle>
      <CardDescription>管理选课记录；删除指定时间段的选课记录；清空所有选课记录</CardDescription>
    </CardHeader>
    <CardContent>
      <div class="flex flex-col gap-8">
        <section class="space-y-4 shadow-lg">
          <div class="bg-amber-50 p-4 rounded-lg">
            <h3 class="font-semibold text-amber-700 mb-2">按时间段删除选课记录</h3>
            <div class="flex flex-col md:flex-row items-start md:items-center gap-4">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                <div class="space-y-2">
                  <Label for="start-date" class="text-amber-700">开始时间</Label>
                  <Input id="start-date" v-model="startDate" type="datetime-local" class="w-full" />
                </div>
                <div class="space-y-2">
                  <Label for="end-date" class="text-amber-700">结束时间</Label>
                  <Input id="end-date" v-model="endDate" type="datetime-local" class="w-full" />
                </div>
              </div>
              <AlertDialog>
                <AlertDialogTrigger as-child>
                  <Button class="mt-4 md:mt-6 bg-red-600 hover:bg-red-700">
                    <TrashIcon class="w-4 h-4 mr-2" />
                    删除记录
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>确认删除</AlertDialogTitle>
                    <AlertDialogDescription>
                      确定要删除 {{ startDate ? new Date(startDate).toLocaleString() : '开始时间' }} 到 {{ endDate ? new Date(endDate).toLocaleString() : '结束时间' }} 之间的所有选课记录吗？此操作无法撤销。
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>取消</AlertDialogCancel>
                    <AlertDialogAction @click="adminStore.deleteChoicesByDateRange(startDate, endDate)" class="bg-red-600 hover:bg-red-700">
                      确认删除
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </section>
        
        <section class="space-y-4 shadow-lg">
          <div class="bg-amber-50 p-4 rounded-lg">
            <div class="flex justify-between items-center mb-2">
              <h3 class="font-semibold text-amber-700">清空所有选课记录</h3>
              <AlertDialog>
                <AlertDialogTrigger as-child>
                  <Button variant="destructive">
                    <TrashIcon class="w-4 h-4 mr-2" />
                    清空所有记录
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>确认清空</AlertDialogTitle>
                    <AlertDialogDescription>
                      确定要清空所有选课记录吗？此操作无法撤销。
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>取消</AlertDialogCancel>
                    <AlertDialogAction @click="adminStore.clearAllChoices()" class="bg-red-600 hover:bg-red-700">
                      确认清空
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
            <p class="text-sm text-gray-600">
              警告：此操作将删除系统中的所有选课记录，请谨慎操作。
            </p>
          </div>
        </section>
        
        <section class="space-y-4 shadow-lg">
          <div class="bg-amber-50 p-4 rounded-lg">
            <h3 class="font-semibold text-amber-700 mb-2">选课记录列表</h3>
            <div class="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>用户</TableHead>
                    <TableHead>选课时间</TableHead>
                    <TableHead>志愿数量</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow v-for="choice in adminStore.choices" :key="choice.id">
                    <TableCell>{{choice.user?.class}} {{ choice.user?.name }}</TableCell>
                    <TableCell>{{ choice.updated.toString() }}</TableCell>
                    <TableCell>{{ choice.choices.length }}</TableCell>
                  </TableRow>
                  <TableRow v-if="adminStore.choices.length === 0">
                    <TableCell colspan="3" class="text-center text-gray-500">
                      暂无选课记录
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
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
