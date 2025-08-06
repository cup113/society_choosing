<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table'
import { useAdminStore } from '@/stores/admin'
import { CalendarIcon, CheckIcon } from 'lucide-vue-next'

const adminStore = useAdminStore()
const startDate = ref('')
const endDate = ref('')

onMounted(() => {
  adminStore.getDates()
})
</script>

<template>
  <Card class="w-full shadow-md bg-amber-100">
    <CardHeader class="rounded-t-lg">
      <CardTitle class="text-amber-800 flex items-center gap-1">
        <CalendarIcon />
        选课管理
      </CardTitle>
      <CardDescription>添加选课活动；指定当前选课活动</CardDescription>
    </CardHeader>
    <CardContent>
      <div class="flex flex-col gap-8">
        <section class="space-y-4 shadow-lg">
          <div class="bg-amber-50 p-4 rounded-lg">
            <h3 class="font-semibold text-amber-700 mb-2">创建选课活动</h3>
            <div class="flex flex-col md:flex-row items-start md:items-center gap-4">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                <div class="space-y-2">
                  <Label for="start-date" class="text-amber-700">选课开始时间</Label>
                  <Input id="start-date" v-model="startDate" type="datetime-local" class="w-full" />
                </div>
                <div class="space-y-2">
                  <Label for="end-date" class="text-amber-700">选课结束时间</Label>
                  <Input id="end-date" v-model="endDate" type="datetime-local" class="w-full" />
                </div>
              </div>
              <Button @click="adminStore.createDate(startDate, endDate)" class="mt-4 md:mt-6 bg-amber-600 hover:bg-amber-700">
                <CheckIcon />
                创建活动
              </Button>
            </div>
          </div>
        </section>
        <section class="space-y-4 shadow-lg">
          <div class="bg-amber-50 p-4 rounded-lg">
            <h3 class="font-semibold text-amber-700 mb-2">当前活动</h3>
            <div class="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>开始时间</TableHead>
                    <TableHead>结束时间</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead>操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow v-for="date in adminStore.dates" :key="date.id">
                    <TableCell>{{ new Date(date.start).toLocaleString() }}</TableCell>
                    <TableCell>{{ new Date(date.end).toLocaleString() }}</TableCell>
                    <TableCell>
                      <span v-if="date.isActive" class="text-green-600 font-semibold">已激活</span>
                      <span v-else class="text-gray-500">未激活</span>
                    </TableCell>
                    <TableCell>
                      <Button v-if="!date.isActive" @click="adminStore.toggleActivateDate(date.id, true)"
                        class="bg-green-600 hover:bg-green-700 mr-2">
                        激活
                      </Button>
                      <Button v-else @click="adminStore.toggleActivateDate(date.id, false)" variant="destructive">
                        取消激活
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow v-if="adminStore.dates.length === 0">
                    <TableCell colspan="4" class="text-center text-gray-500">
                      暂无活动数据
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
        </section>
      </div>
    </CardContent>
    <CardFooter class="font-bold" v-show="adminStore.dateSuccessHint">
      <p class="text-green-600">{{ adminStore.dateSuccessHint }}</p>
    </CardFooter>
  </Card>
</template>
