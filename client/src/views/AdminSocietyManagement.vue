<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import { Command, CommandGroup, CommandInput, CommandList, CommandItem, CommandEmpty } from '@/components/ui/command'
import { useAdminStore } from '@/stores/admin'
import GroupIcon from '@/components/icon/GroupIcon.vue'
import TickIcon from '@/components/icon/TickIcon.vue'

const adminStore = useAdminStore()
const societyImportData = ref('')
const editingSocietyId = ref<string | null>(null)
const editingField = ref<string | null>(null)
const editingValue = ref<string | number>('')

onMounted(() => {
    adminStore.getSocieties()
})

function startEditingField(societyId: string, field: string, value: string | number) {
    editingSocietyId.value = societyId
    editingField.value = field
    editingValue.value = value
}

function cancelEditingField() {
    editingSocietyId.value = null
    editingField.value = null
}

function updateSocietyField(societyId: string, field: string, value: string | number) {
    adminStore.updateSocietyField(societyId, field, value)
    cancelEditingField()
}
</script>

<template>
    <Card class="w-full shadow-md bg-amber-100">
        <CardHeader class="rounded-t-lg">
            <CardTitle class="text-amber-800 flex items-center gap-1">
                <GroupIcon />
                社团管理
            </CardTitle>
            <CardDescription>从 Excel 批量导入社团；修改社团信息；删除社团；管理社团核心成员</CardDescription>
        </CardHeader>
        <CardContent>
            <div class="flex flex-col gap-8">
                <section class="space-y-4 shadow-lg">
                    <div class="bg-amber-50 p-4 rounded-lg">
                        <h3 class="font-semibold text-amber-700 mb-2">批量导入社团</h3>
                        <p class="text-sm text-gray-600 mb-3">从 Excel 文件复制后粘贴到以下输入框。表头：名称、限额、指导教师、描述、限制。</p>
                        <Textarea v-model="societyImportData" class="min-h-[120px] mb-3" placeholder="粘贴社团数据..." />
                        <Button @click="adminStore.importSocieties(societyImportData)"
                            class="bg-amber-600 hover:bg-amber-700">
                            <TickIcon />
                            导入社团
                        </Button>
                    </div>
                </section>

                <!-- 社团基本信息管理 -->
                <section class="space-y-4 shadow-lg">
                    <div class="bg-amber-50 p-4 rounded-lg">
                        <h3 class="font-semibold text-amber-700 mb-2">社团基本信息管理</h3>
                        <div class="space-y-4">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>名称</TableHead>
                                        <TableHead>限额</TableHead>
                                        <TableHead>指导教师</TableHead>
                                        <TableHead>描述</TableHead>
                                        <TableHead>限制</TableHead>
                                        <TableHead>操作</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <TableRow v-for="society in adminStore.societies" :key="society.id">
                                        <!-- 名称字段 -->
                                        <TableCell>
                                            <template v-if="editingSocietyId === society.id && editingField === 'name'">
                                                <Input v-model="editingValue" class="w-full" />
                                                <div class="flex gap-1 mt-1">
                                                    <Button
                                                        @click="updateSocietyField(society.id, 'name', editingValue)"
                                                        class="h-6 px-2 bg-green-600 hover:bg-green-700">
                                                        √
                                                    </Button>
                                                    <Button @click="cancelEditingField" class="h-6 px-2"
                                                        variant="outline">
                                                        ×
                                                    </Button>
                                                </div>
                                            </template>
                                            <template v-else>
                                                <div @click="startEditingField(society.id, 'name', society.name)"
                                                    class="cursor-pointer hover:bg-amber-100 p-1 rounded">
                                                    {{ society.name }}
                                                </div>
                                            </template>
                                        </TableCell>

                                        <!-- 限额字段 -->
                                        <TableCell>
                                            <template v-if="editingSocietyId === society.id && editingField === 'cap'">
                                                <Input v-model.number="editingValue" type="number" class="w-full" />
                                                <div class="flex gap-1 mt-1">
                                                    <Button
                                                        @click="updateSocietyField(society.id, 'cap', Number(editingValue))"
                                                        class="h-6 px-2 bg-green-600 hover:bg-green-700">
                                                        √
                                                    </Button>
                                                    <Button @click="cancelEditingField" class="h-6 px-2"
                                                        variant="outline">
                                                        ×
                                                    </Button>
                                                </div>
                                            </template>
                                            <template v-else>
                                                <div @click="startEditingField(society.id, 'cap', society.cap)"
                                                    class="cursor-pointer hover:bg-amber-100 p-1 rounded">
                                                    {{ society.cap }}
                                                </div>
                                            </template>
                                        </TableCell>

                                        <!-- 指导教师字段 -->
                                        <TableCell>
                                            <template
                                                v-if="editingSocietyId === society.id && editingField === 'teacher'">
                                                <Input v-model="editingValue" class="w-full" />
                                                <div class="flex gap-1 mt-1">
                                                    <Button
                                                        @click="updateSocietyField(society.id, 'teacher', editingValue)"
                                                        class="h-6 px-2 bg-green-600 hover:bg-green-700">
                                                        √
                                                    </Button>
                                                    <Button @click="cancelEditingField" class="h-6 px-2"
                                                        variant="outline">
                                                        ×
                                                    </Button>
                                                </div>
                                            </template>
                                            <template v-else>
                                                <div @click="startEditingField(society.id, 'teacher', society.teacher)"
                                                    class="cursor-pointer hover:bg-amber-100 p-1 rounded">
                                                    {{ society.teacher }}
                                                </div>
                                            </template>
                                        </TableCell>

                                        <!-- 描述字段 -->
                                        <TableCell>
                                            <template
                                                v-if="editingSocietyId === society.id && editingField === 'description'">
                                                <Textarea v-model="editingValue" class="w-full min-h-[60px]" />
                                                <div class="flex gap-1 mt-1">
                                                    <Button
                                                        @click="updateSocietyField(society.id, 'description', editingValue)"
                                                        class="h-6 px-2 bg-green-600 hover:bg-green-700">
                                                        √
                                                    </Button>
                                                    <Button @click="cancelEditingField" class="h-6 px-2"
                                                        variant="outline">
                                                        ×
                                                    </Button>
                                                </div>
                                            </template>
                                            <template v-else>
                                                <div @click="startEditingField(society.id, 'description', society.description)"
                                                    class="cursor-pointer hover:bg-amber-100 p-1 rounded min-h-[40px]">
                                                    {{ society.description }}
                                                </div>
                                            </template>
                                        </TableCell>

                                        <!-- 限制字段 -->
                                        <TableCell>
                                            <template
                                                v-if="editingSocietyId === society.id && editingField === 'limit'">
                                                <Input v-model="editingValue" class="w-full" />
                                                <div class="flex gap-1 mt-1">
                                                    <Button
                                                        @click="updateSocietyField(society.id, 'limit', editingValue)"
                                                        class="h-6 px-2 bg-green-600 hover:bg-green-700">
                                                        √
                                                    </Button>
                                                    <Button @click="cancelEditingField" class="h-6 px-2"
                                                        variant="outline">
                                                        ×
                                                    </Button>
                                                </div>
                                            </template>
                                            <template v-else>
                                                <div @click="startEditingField(society.id, 'limit', society.limit || '')"
                                                    class="cursor-pointer hover:bg-amber-100 p-1 rounded">
                                                    {{ society.limit }}
                                                </div>
                                            </template>
                                        </TableCell>

                                        <!-- 删除操作 -->
                                        <TableCell>
                                            <Button @click="adminStore.deleteSociety(society.id)" variant="destructive"
                                                size="sm">
                                                删除
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow v-if="adminStore.societies.length === 0">
                                        <TableCell colspan="6" class="text-center text-gray-500">
                                            暂无社团数据
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </section>

                <!-- 社团核心成员管理 -->
                <section class="space-y-4 shadow-lg">
                    <div class="bg-amber-50 p-4 rounded-lg">
                        <h3 class="font-semibold text-amber-700 mb-2">社团核心成员管理</h3>
                        <div class="space-y-4">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>社团名称</TableHead>
                                        <TableHead>核心成员</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <template v-for="society in adminStore.societies" :key="society.id">
                                        <TableRow>
                                            <TableCell>{{ society.name }}</TableCell>
                                            <TableCell>
                                                <div class="flex flex-wrap gap-2">
                                                    <div v-for="memberId in society.coreMembers || []" :key="memberId"
                                                        class="relative group">
                                                        <div
                                                            class="bg-amber-100 px-3 py-1 rounded-full text-sm flex items-center relative">
                                                            {{ adminStore.getUserClassNameById(memberId) }}
                                                            <Button
                                                                @click="adminStore.removeCoreMember(society.id, memberId)"
                                                                class="ml-1 h-4 w-4 p-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity absolute -top-1 -right-1"
                                                                variant="destructive">
                                                                ×
                                                            </Button>
                                                        </div>
                                                    </div>

                                                    <!-- 添加核心成员的ComboBox -->
                                                    <Popover>
                                                        <PopoverTrigger as-child>
                                                            <Button variant="outline" class="w-8 h-8 p-0 rounded-full">
                                                                +
                                                            </Button>
                                                        </PopoverTrigger>
                                                        <PopoverContent class="p-0" align="start">
                                                            <Command>
                                                                <CommandInput placeholder="搜索用户..." />
                                                                <CommandList>
                                                                    <CommandEmpty>未找到用户</CommandEmpty>
                                                                    <CommandGroup>
                                                                        <CommandItem
                                                                            v-for="user in adminStore.users.filter(u => u.role !== 'teacher')"
                                                                            :key="user.id" :value="user.id"
                                                                            @select="adminStore.addCoreMember(society.id, user.id)"
                                                                            class="flex items-center">
                                                                            <div class="flex items-center">
                                                                                <span class="font-medium">{{ user.name
                                                                                    }}</span>
                                                                                <span
                                                                                    class="text-gray-500 text-sm ml-2">{{
                                                                                    user.class }}</span>
                                                                            </div>
                                                                        </CommandItem>
                                                                    </CommandGroup>
                                                                </CommandList>
                                                            </Command>
                                                        </PopoverContent>
                                                    </Popover>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    </template>
                                    <TableRow v-if="adminStore.societies.length === 0">
                                        <TableCell colspan="3" class="text-center text-gray-500">
                                            暂无社团数据
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </section>
            </div>
        </CardContent>
        <CardFooter class="font-bold text-green-600" v-show="adminStore.societySuccessHint">
            <p>{{ adminStore.societySuccessHint }}</p>
        </CardFooter>
    </Card>
</template>