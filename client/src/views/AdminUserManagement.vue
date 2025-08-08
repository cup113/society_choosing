<script lang="ts" setup>
import { ref, onMounted, watch, inject } from 'vue'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table'
import { useAdminStore } from '@/stores/admin'
import { UserIcon, CheckIcon, DeleteIcon, SearchIcon, EditIcon, SaveIcon, XIcon } from 'lucide-vue-next'
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog'

const adminStore = useAdminStore()
const userImportData = ref('')
const userDeleteClass = ref('')
const searchQuery = ref('')

// 编辑用户相关的状态
const editingUserId = ref<string | null>(null)
const editingField = ref<string | null>(null)
const editingValue = ref<string>('')

// 注入toast方法
const showToast = inject('showToast', (message: string, type: 'success' | 'error' = 'success') => {
  console.log(`${type}: ${message}`)
})

onMounted(() => {
  adminStore.getUsers()
  // 初始化过滤用户
  adminStore.filterUsers()
})

// 监听搜索查询变化
watch(searchQuery, (newQuery) => {
  adminStore.setSearchQuery(newQuery)
})

// 开始编辑字段
function startEditingField(userId: string, field: string, value: string) {
  editingUserId.value = userId
  editingField.value = field
  editingValue.value = value
}

// 取消编辑
function cancelEditing() {
  editingUserId.value = null
  editingField.value = null
  editingValue.value = ''
}

// 保存编辑
async function saveEditing(userId: string) {
  try {
    if (editingField.value) {
      await adminStore.updateUser(userId, editingField.value, editingValue.value)
      cancelEditing()
      showToast('已成功更新用户信息', 'success')
    }
  } catch (error: any) {
    showToast('更新失败: ' + error.message, 'error')
  }
}

// 删除单个用户
async function deleteUser(userId: string) {
  try {
    await adminStore.deleteUser(userId)
    showToast('已成功删除用户', 'success')
  } catch (error: any) {
    showToast('删除失败: ' + error.message, 'error')
  }
}

// 包装importUsers方法以使用toast
async function importUsers() {
  try {
    await adminStore.importUsers(userImportData.value)
    userImportData.value = ''
    showToast('已成功导入用户', 'success')
  } catch (error: any) {
    showToast('导入失败: ' + error.message, 'error')
  }
}

// 包装deleteUsers方法以使用toast
async function deleteUsers() {
  try {
    await adminStore.deleteUsers(userDeleteClass.value)
    userDeleteClass.value = ''
    showToast('已成功删除用户', 'success')
  } catch (error: any) {
    showToast('删除失败: ' + error.message, 'error')
  }
}
</script>

<template>
  <Card class="w-full shadow-md bg-amber-100">
    <CardHeader class="rounded-t-lg">
      <CardTitle class="text-amber-800 flex items-center gap-1">
        <UserIcon />
        用户管理
      </CardTitle>
      <CardDescription>
        从 Excel 批量导入用户；按班级批量删除用户；搜索和编辑用户
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div class="flex flex-col gap-8">
        <section class="space-y-4 shadow-lg">
          <div class="bg-amber-50 p-4 rounded-lg">
            <h3 class="font-semibold text-amber-700 mb-2">批量导入用户</h3>
            <p class="text-sm text-gray-600 mb-3">从 Excel 文件复制后粘贴到以下输入框。表头：班级、学号、密码、姓名、性别、角色。</p>
            <Textarea v-model="userImportData" class="min-h-[120px] mb-3" placeholder="粘贴用户数据..." />
            <Button @click="importUsers" class="bg-amber-600 hover:bg-amber-700">
              <CheckIcon />
              导入用户
            </Button>
          </div>
        </section>

        <section class="space-y-4 shadow-lg">
          <div class="bg-amber-50 p-4 rounded-lg">
            <h3 class="font-semibold text-amber-700 mb-2">搜索用户</h3>
            <div class="flex gap-2 mb-4">
              <div class="relative flex-1">
                <SearchIcon class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input 
                  v-model="searchQuery" 
                  placeholder="按姓名、班级、学号或 {姓名}-{班级}-{学号} 搜索" 
                  class="pl-10 w-full" 
                />
              </div>
            </div>
            
            <!-- 用户表格 -->
            <div class="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>班级</TableHead>
                    <TableHead>学号</TableHead>
                    <TableHead>姓名</TableHead>
                    <TableHead>性别</TableHead>
                    <TableHead>角色</TableHead>
                    <TableHead>操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <template v-for="user in adminStore.getCurrentPageUsers()" :key="user.id">
                    <TableRow>
                      <TableCell>
                        <template v-if="editingUserId === user.id && editingField === 'class'">
                          <Input v-model="editingValue" class="w-full" />
                        </template>
                        <template v-else>
                          <div @click="startEditingField(user.id, 'class', user.class)"
                            class="cursor-pointer hover:bg-amber-100 p-1 rounded">
                            {{ user.class }}
                          </div>
                        </template>
                      </TableCell>
                      <TableCell>
                        <template v-if="editingUserId === user.id && editingField === 'username'">
                          <Input v-model="editingValue" class="w-full" />
                        </template>
                        <template v-else>
                          <div @click="startEditingField(user.id, 'username', user.username)"
                            class="cursor-pointer hover:bg-amber-100 p-1 rounded">
                            {{ user.username }}
                          </div>
                        </template>
                      </TableCell>
                      <TableCell>
                        <template v-if="editingUserId === user.id && editingField === 'name'">
                          <Input v-model="editingValue" class="w-full" />
                        </template>
                        <template v-else>
                          <div @click="startEditingField(user.id, 'name', user.name)"
                            class="cursor-pointer hover:bg-amber-100 p-1 rounded">
                            {{ user.name }}
                          </div>
                        </template>
                      </TableCell>
                      <TableCell>
                        <template v-if="editingUserId === user.id && editingField === 'gender'">
                          <Select v-model="editingValue">
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="male">男</SelectItem>
                              <SelectItem value="female">女</SelectItem>
                            </SelectContent>
                          </Select>
                        </template>
                        <template v-else>
                          <div @click="startEditingField(user.id, 'gender', user.gender)"
                            class="cursor-pointer hover:bg-amber-100 p-1 rounded">
                            {{ user.gender === 'male' ? '男' : '女' }}
                          </div>
                        </template>
                      </TableCell>
                      <TableCell>
                        <template v-if="editingUserId === user.id && editingField === 'role'">
                          <Select v-model="editingValue">
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="student">学生</SelectItem>
                              <SelectItem value="teacher">教师</SelectItem>
                            </SelectContent>
                          </Select>
                        </template>
                        <template v-else>
                          <div @click="startEditingField(user.id, 'role', user.role)"
                            class="cursor-pointer hover:bg-amber-100 p-1 rounded">
                            {{ user.role === 'teacher' ? '教师' : '学生' }}
                          </div>
                        </template>
                      </TableCell>
                      <TableCell>
                        <div class="flex gap-1">
                          <template v-if="editingUserId === user.id">
                            <Button @click="saveEditing(user.id)" size="sm" class="h-8 px-2 bg-green-600 hover:bg-green-700">
                              <SaveIcon class="w-4 h-4" />
                            </Button>
                            <Button @click="cancelEditing" size="sm" class="h-8 px-2" variant="outline">
                              <XIcon class="w-4 h-4" />
                            </Button>
                          </template>
                          <template v-else>
                            <Button @click="startEditingField(user.id, '', '')" size="sm" variant="outline" class="h-8 px-2">
                              <EditIcon class="w-4 h-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger as-child>
                                <Button size="sm" variant="destructive" class="h-8 px-2">
                                  <DeleteIcon class="w-4 h-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>确认删除</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    确定要删除用户 {{ user.name }} 吗？此操作无法撤销。
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>取消</AlertDialogCancel>
                                  <AlertDialogAction @click="deleteUser(user.id)" class="bg-red-600 hover:bg-red-700">
                                    确认删除
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </template>
                        </div>
                      </TableCell>
                    </TableRow>
                  </template>
                  <TableRow v-if="adminStore.getCurrentPageUsers().length === 0">
                    <TableCell colspan="6" class="text-center text-gray-500">
                      暂无用户数据
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              
              <!-- 分页控件 -->
              <div class="flex justify-between items-center">
                <div class="text-sm text-gray-600">
                  显示第 {{ (adminStore.currentPage - 1) * adminStore.usersPerPage + 1 }} 到 {{ Math.min(adminStore.currentPage * adminStore.usersPerPage, adminStore.filteredUsers.length) }} 条，共 {{ adminStore.filteredUsers.length }} 条记录
                </div>
                <div class="flex gap-2">
                  <Button 
                    @click="adminStore.setCurrentPage(adminStore.currentPage - 1)" 
                    :disabled="adminStore.currentPage <= 1"
                    variant="outline"
                  >
                    上一页
                  </Button>
                  <span class="flex items-center px-3">
                    第 {{ adminStore.currentPage }} 页，共 {{ adminStore.totalPages }} 页
                  </span>
                  <Button 
                    @click="adminStore.setCurrentPage(adminStore.currentPage + 1)" 
                    :disabled="adminStore.currentPage >= adminStore.totalPages"
                    variant="outline"
                  >
                    下一页
                  </Button>
                </div>
              </div>
            </div>
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
              <Button variant="destructive" @click="deleteUsers" class="w-full sm:w-auto">
                <DeleteIcon />
                删除用户
              </Button>
            </div>
          </div>
        </section>
      </div>
    </CardContent>
  </Card>
</template>
