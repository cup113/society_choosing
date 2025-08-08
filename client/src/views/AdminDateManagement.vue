<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table'
import { useAdminStore } from '@/stores/admin'
import { CalendarIcon, CheckIcon, EditIcon, TrashIcon } from 'lucide-vue-next'
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog'

const adminStore = useAdminStore()
const startDate = ref('')
const endDate = ref('')

const editingDateId = ref<string | null>(null)
const editingStartDate = ref('')
const editingEndDate = ref('')

onMounted(() => {
  adminStore.getDates()
})

function startEditing(date: any) {
  editingDateId.value = date.id
  editingStartDate.value = formatDateForInput(date.start)
  editingEndDate.value = formatDateForInput(date.end)
}

function cancelEditing() {
  editingDateId.value = null
  editingStartDate.value = ''
  editingEndDate.value = ''
}

async function updateDate() {
  if (editingDateId.value) {
    await adminStore.updateDate(editingDateId.value, editingStartDate.value, editingEndDate.value)
    cancelEditing()
  }
}

function formatDateForInput(dateString: string) {
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day}T${hours}:${minutes}`
}
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
                  <template v-for="date in adminStore.dates" :key="date.id">
                    <TableRow v-if="editingDateId !== date.id">
                      <TableCell>{{ new Date(date.start).toLocaleString() }}</TableCell>
                      <TableCell>{{ new Date(date.end).toLocaleString() }}</TableCell>
                      <TableCell>
                        <span v-if="date.isActive" class="text-green-600 font-semibold">已激活</span>
                        <span v-else class="text-gray-500">未激活</span>
                      </TableCell>
                      <TableCell class="flex gap-2">
                        <Button v-if="!date.isActive" @click="adminStore.toggleActivateDate(date.id, true)"
                          class="bg-green-600 hover:bg-green-700">
                          激活
                        </Button>
                        <Button v-else @click="adminStore.toggleActivateDate(date.id, false)" variant="destructive">
                          取消激活
                        </Button>
                        <Button @click="startEditing(date)" variant="outline" size="sm">
                          <EditIcon class="w-4 h-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger as-child>
                            <Button variant="destructive" size="sm">
                              <TrashIcon class="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>确认删除</AlertDialogTitle>
                              <AlertDialogDescription>
                                确定要删除这个选课活动吗？此操作无法撤销。
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>取消</AlertDialogCancel>
                              <AlertDialogAction @click="adminStore.deleteDate(date.id)" class="bg-red-600 hover:bg-red-700">
                                确认删除
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                    <TableRow v-else>
                      <TableCell colspan="4">
                        <div class="flex flex-col md:flex-row items-start md:items-center gap-4">
                          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                            <div class="space-y-2">
                              <Label for="edit-start-date" class="text-amber-700">选课开始时间</Label>
                              <Input id="edit-start-date" v-model="editingStartDate" type="datetime-local" class="w-full" />
                            </div>
                            <div class="space-y-2">
                              <Label for="edit-end-date" class="text-amber-700">选课结束时间</Label>
                              <Input id="edit-end-date" v-model="editingEndDate" type="datetime-local" class="w-full" />
                            </div>
                          </div>
                          <div class="flex gap-2">
                            <Button @click="updateDate" class="bg-green-600 hover:bg-green-700">
                              保存
                            </Button>
                            <Button @click="cancelEditing" variant="outline">
                              取消
                            </Button>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  </template>
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
  </Card>
</template>
