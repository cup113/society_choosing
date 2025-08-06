<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Command, CommandGroup, CommandInput, CommandList, CommandItem, CommandEmpty } from '@/components/ui/command';
import { Label } from '@/components/ui/label';
import { Fetcher } from '@/lib/fetch';
import { useErrorStore } from '@/stores/error';
import { type User, type DatesRecord, type Society, type ListSocietyResponse } from '../../../types/types';

import TickIcon from '@/components/icon/TickIcon.vue';
import DeleteIcon from '@/components/icon/DeleteIcon.vue';
import UserIcon from '@/components/icon/UserIcon.vue';
import CalendarIcon from '@/components/icon/CalendarIcon.vue';
import GroupIcon from '@/components/icon/GroupIcon.vue';

const errorStore = useErrorStore();

const userSuccessHint = ref('');
const dateSuccessHint = ref('');
const societySuccessHint = ref('');

const users = ref<User[]>([]);
const userImportData = ref('');
const userDeleteClass = ref('');
const classes = computed(() => {
    const map = new Map<string, { name: string, count: number }>();
    users.value.filter(user => user.role !== 'teacher').forEach(user => {
        const class_ = user.class;
        if (!map.has(class_)) {
            map.set(class_, { name: class_, count: 0 });
        }
        map.get(class_)!.count++;
    });
    return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
});

const dates = ref<DatesRecord[]>([]);
const startDate = ref('');
const endDate = ref('');

const societies = ref<Society[]>([]);
const societyImportData = ref('');
const editingSocietyId = ref<string | null>(null);
const editingField = ref<string | null>(null);
const editingValue = ref<string | number>('');

function get_users() {
    new Fetcher<User[]>({
        url: '/api/admin/user/list',
        method: 'GET'
    }).fetch_json().then(data => {
        users.value = data;
    }).catch(error => {
        errorStore.add_error("获取用户失败：" + error.toString());
    });
}

function get_dates() {
    new Fetcher<DatesRecord[]>({
        url: '/api/admin/date/list',
        method: 'GET'
    }).fetch_json().then(data => {
        dates.value = data;
    }).catch(error => {
        errorStore.add_error("获取日期失败：" + error.toString());
    });
}

function get_societies() {
    new Fetcher<ListSocietyResponse>({
        url: '/api/societies/list',
        method: 'GET'
    }).fetch_json().then(data => {
        societies.value = data.societies;
    }).catch(error => {
        errorStore.add_error("获取社团失败：" + error.toString());
    });
}

onMounted(() => {
    get_users();
    get_dates();
    get_societies();
})

async function importUsers() {
    try {
        if (!userImportData.value) {
            errorStore.add_error('请粘贴用户数据');
            return;
        }

        const lines = userImportData.value.trim().split('\n');
        if (lines.length < 2) {
            errorStore.add_error('数据格式不正确，至少需要包含表头和一行数据');
            return;
        }

        const header = lines[0].split('\t');
        const indexMap = {
            class: header.indexOf('班级'),
            username: header.indexOf('学号'),
            password: header.indexOf('密码'),
            name: header.indexOf('姓名'),
            gender: header.indexOf('性别'),
            role: header.indexOf('角色')
        }

        Object.entries(indexMap).forEach(([key, value]) => {
            if (value === -1) {
                errorStore.add_error(`数据格式错误，缺少列 ${key}`);
                return;
            }
        });

        const usersToAdd = lines.slice(1).map(line => {
            const values = line.split('\t');
            const gender = ["male", "男"].includes(values[indexMap.gender]) ? 'male' : 'female';
            const role = ["teacher", "教师"].includes(values[indexMap.role]) ? 'teacher' : 'student';
            const password = values[indexMap.password] || ''
            return {
                class: values[indexMap.class] || '',
                username: values[indexMap.username] || '',
                password,
                passwordConfirm: password,
                name: values[indexMap.name] || '',
                gender,
                role,
            };
        });

        const newUsers = await new Fetcher<User[]>({
            url: '/api/admin/user/import',
            method: 'POST',
            data: JSON.stringify(usersToAdd)
        }).fetch_json()

        userImportData.value = '';

        let totalNewUsers = 0;
        let totalModifiedUsers = 0;
        newUsers.forEach(newUser => {
            const index = users.value.findIndex(user => user.id === newUser.id);
            if (index !== -1) {
                users.value[index] = newUser;
                totalModifiedUsers++;
            } else {
                users.value.push(newUser);
                totalNewUsers++;
            }
        });

        userSuccessHint.value = `已成功新建 ${totalNewUsers} 位用户，修改 ${totalModifiedUsers} 位用户。`

    } catch (error: any) {
        errorStore.add_error(`导入失败: ${error.message}`);
    }
}

async function deleteUsers() {
    if (!userDeleteClass.value) {
        errorStore.add_error('请选择班级');
        return;
    }
    if (!confirm('确定要删除这些用户吗？此操作不可逆。')) {
        return;
    }
    try {
        const usersToDelete = users.value.filter(user => user.class === userDeleteClass.value).map(user => user.id)
        await new Fetcher({
            url: '/api/admin/user/delete',
            method: 'POST',
            data: JSON.stringify(usersToDelete),
        }).fetch_json();
        users.value = users.value.filter(user => user.class !== userDeleteClass.value);
        userSuccessHint.value = `已成功删除 ${userDeleteClass.value} 的 ${usersToDelete.length} 位用户。`
        userDeleteClass.value = '';
    } catch (error: any) {
        errorStore.add_error(`删除失败: ${error.message}`);
    }
}

async function createDate() {
    try {
        if (!startDate.value || !endDate.value) {
            errorStore.add_error('请选择开始时间和结束时间');
            return;
        }

        const data = {
            start: new Date(startDate.value).toISOString(),
            end: new Date(endDate.value).toISOString()
        };

        const result = await new Fetcher<DatesRecord>({
            url: '/api/admin/date/create',
            method: 'POST',
            data: JSON.stringify(data)
        }).fetch_json();

        dates.value.push(result);
        dateSuccessHint.value = `已创建选课活动 ${result.start} - ${result.end}`;
        startDate.value = '';
        endDate.value = '';
    } catch (error: any) {
        errorStore.add_error(`创建选课活动失败: ${error.message}`);
    }
}

async function toggleActivateDate(id: string, activate: boolean) {
    try {
        const data = {
            id,
            activate,
        };

        await new Fetcher<DatesRecord>({
            url: '/api/admin/date/activate',
            method: 'POST',
            data: JSON.stringify(data),
        }).fetch_json();

        const index = dates.value.findIndex(date => date.id == id)
        dates.value[index].isActive = activate;
        const startDate = new Date(dates.value[index].start).toLocaleString()
        dateSuccessHint.value = `成功 ${activate ? '激活' : '取消激活'} 选课活动（开始于 ${startDate}）`;
    } catch (error) {
        errorStore.add_error(`操作失败: ${error instanceof Error ? error.message : error}`);
    }
}

async function importSocieties() {
    try {
        if (!societyImportData.value) {
            errorStore.add_error('请粘贴社团数据');
            return;
        }

        const lines = societyImportData.value.trim().split('\n');

        const header = lines[0].split('\t');
        const indexMap = {
            name: header.indexOf('名称'),
            cap: header.indexOf('限额'),
            teacher: header.indexOf('指导教师'),
            description: header.indexOf('描述'),
            limit: header.indexOf('限制'),
        }
        Object.entries(indexMap).forEach(([key, value]) => {
            if (value === -1) {
                errorStore.add_error(`数据格式错误，缺少列 ${key}`);
                return;
            }
        });

        const societiesToImport = lines.slice(1).map(line => {
            const values = line.split('\t');
            return {
                name: values[indexMap.name],
                cap: parseInt(values[indexMap.cap]),
                teacher: values[indexMap.teacher],
                description: values[indexMap.description],
                limit: values[indexMap.limit],
            };
        });

        const newSocieties = await new Fetcher<Society[]>({
            url: '/api/admin/society/import',
            method: 'POST',
            data: JSON.stringify(societiesToImport)
        }).fetch_json();

        let societyCreatedCount = 0;
        let societyUpdatedCount = 0;
        newSocieties.forEach(society => {
            const index = societies.value.findIndex(soc => soc.id === society.id)
            if (index === -1) {
                societyCreatedCount++;
                societies.value.push(society);
            } else {
                societyUpdatedCount++;
                societies.value[index] = society;
            }
        });

        societySuccessHint.value = `已成功导入 ${societyCreatedCount} 个社团，更新 ${societyUpdatedCount} 个社团`;

        societyImportData.value = '';
    } catch (error: any) {
        errorStore.add_error(`导入失败: ${error.message}`);
    }
}

async function updateSocietyField(societyId: string, field: string, value: string | number) {
    try {
        const societyToUpdate = societies.value.find(s => s.id === societyId);
        if (!societyToUpdate) {
            errorStore.add_error('未找到要更新的社团');
            return;
        }

        const updateData: Partial<Society> = { ...societyToUpdate };
        updateData[field as keyof Society] = value as never;

        const updatedSociety = await new Fetcher<Society>({
            url: '/api/admin/society/update',
            method: 'POST',
            data: JSON.stringify({ id: societyId, [field]: value })
        }).fetch_json();

        const index = societies.value.findIndex(s => s.id === societyId);
        if (index !== -1) {
            societies.value[index] = updatedSociety;
        }

        editingSocietyId.value = null;
        editingField.value = null;
        societySuccessHint.value = `已成功更新社团 ${updatedSociety.name} 的 ${field} 字段`;
    } catch (error: any) {
        errorStore.add_error(`更新社团失败: ${error.message}`);
    }
}

function startEditingField(societyId: string, field: string, value: string | number) {
    editingSocietyId.value = societyId;
    editingField.value = field;
    editingValue.value = value;
}

function cancelEditingField() {
    editingSocietyId.value = null;
    editingField.value = null;
}

async function deleteSociety(societyId: string) {
    try {
        if (!confirm('确定要删除这个社团吗？此操作不可逆。')) {
            return;
        }

        await new Fetcher({
            url: '/api/admin/society/delete',
            method: 'POST',
            data: JSON.stringify([societyId])
        }).fetch_json();

        societies.value = societies.value.filter(s => s.id !== societyId);
        societySuccessHint.value = '已成功删除社团';
    } catch (error: any) {
        errorStore.add_error(`删除社团失败: ${error.message}`);
    }
}

async function addCoreMember(societyId: string, userId: string) {
    try {
        const society = societies.value.find(s => s.id === societyId);
        if (!society) {
            errorStore.add_error('未找到社团');
            return;
        }

        const updatedCoreMembers = [...(society.coreMembers || []), userId];

        const updatedSociety = await new Fetcher<Society>({
            url: '/api/admin/society/update',
            method: 'POST',
            data: JSON.stringify({
                id: societyId,
                coreMembers: updatedCoreMembers
            })
        }).fetch_json();

        const index = societies.value.findIndex(s => s.id === societyId);
        if (index !== -1) {
            societies.value[index] = updatedSociety;
        }

        societySuccessHint.value = `已成功添加核心成员`;
    } catch (error: any) {
        errorStore.add_error(`添加核心成员失败: ${error.message}`);
    }
}

async function removeCoreMember(societyId: string, userId: string) {
    try {
        const society = societies.value.find(s => s.id === societyId);
        if (!society) {
            errorStore.add_error('未找到社团');
            return;
        }

        const updatedCoreMembers = (society.coreMembers || []).filter(id => id !== userId);

        const updatedSociety = await new Fetcher<Society>({
            url: '/api/admin/society/update',
            method: 'POST',
            data: JSON.stringify({
                id: societyId,
                coreMembers: updatedCoreMembers
            })
        }).fetch_json();

        const index = societies.value.findIndex(s => s.id === societyId);
        if (index !== -1) {
            societies.value[index] = updatedSociety;
        }

        societySuccessHint.value = `已成功移除核心成员`;
    } catch (error: any) {
        errorStore.add_error(`移除核心成员失败: ${error.message}`);
    }
}

function getUserClassNameById(userId: string) {
    const user = users.value.find(u => u.id === userId);
    return user ? `${user.class} ${user.name}` : '未知用户';
}
</script>

<template>
    <main class="flex flex-col w-full max-w-4xl mx-auto gap-6 py-6">
        <div class="text-center mb-2">
            <h1 class="text-3xl font-bold text-amber-800">管理系统</h1>
            <p class="text-amber-600">管理用户、选课活动和社团信息</p>
        </div>

        <Card class="w-full shadow-md bg-amber-100">
            <CardHeader class="rounded-t-lg">
                <CardTitle class="text-amber-800 flex items-center gap-1">
                    <UserIcon></UserIcon>
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
                            <Button @click="importUsers" class="bg-amber-600 hover:bg-amber-700">
                                <TickIcon></TickIcon>
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
                                            <SelectItem v-for="class_ in classes" :key="class_.name"
                                                :value="class_.name">
                                                {{ class_.name }} ({{ class_.count }} 人)
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <Button variant="destructive" @click="deleteUsers" class="w-full sm:w-auto">
                                    <DeleteIcon></DeleteIcon>
                                    删除用户
                                </Button>
                            </div>
                        </div>
                    </section>
                </div>
            </CardContent>
            <CardFooter class="font-bold" v-show="userSuccessHint">
                <p class="text-green-600">{{ userSuccessHint }}</p>
            </CardFooter>
        </Card>

        <Card class="w-full shadow-md bg-amber-100">
            <CardHeader class="rounded-t-lg">
                <CardTitle class="text-amber-800 flex items-center gap-1">
                    <CalendarIcon></CalendarIcon>
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
                                        <Input id="start-date" v-model="startDate" type="datetime-local"
                                            class="w-full" />
                                    </div>
                                    <div class="space-y-2">
                                        <Label for="end-date" class="text-amber-700">选课结束时间</Label>
                                        <Input id="end-date" v-model="endDate" type="datetime-local" class="w-full" />
                                    </div>
                                </div>
                                <Button @click="createDate" class="mt-4 md:mt-6 bg-amber-600 hover:bg-amber-700">
                                    <TickIcon></TickIcon>
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
                                        <TableRow v-for="date in dates" :key="date.id">
                                            <TableCell>{{ new Date(date.start).toLocaleString() }}</TableCell>
                                            <TableCell>{{ new Date(date.end).toLocaleString() }}</TableCell>
                                            <TableCell>
                                                <span v-if="date.isActive"
                                                    class="text-green-600 font-semibold">已激活</span>
                                                <span v-else class="text-gray-500">未激活</span>
                                            </TableCell>
                                            <TableCell>
                                                <Button v-if="!date.isActive" @click="toggleActivateDate(date.id, true)"
                                                    class="bg-green-600 hover:bg-green-700 mr-2">
                                                    激活
                                                </Button>
                                                <Button v-else @click="toggleActivateDate(date.id, false)"
                                                    variant="destructive">
                                                    取消激活
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow v-if="dates.length === 0">
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
            <CardFooter class="font-bold" v-show="dateSuccessHint">
                <p class="text-green-600">{{ dateSuccessHint }}</p>
            </CardFooter>
        </Card>

        <Card class="w-full shadow-md bg-amber-100">
            <CardHeader class="rounded-t-lg">
                <CardTitle class="text-amber-800 flex items-center gap-1">
                    <GroupIcon></GroupIcon>
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
                            <Button @click="importSocieties" class="bg-amber-600 hover:bg-amber-700">
                                <TickIcon></TickIcon>
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
                                        <TableRow v-for="society in societies" :key="society.id">
                                            <!-- 名称字段 -->
                                            <TableCell>
                                                <template
                                                    v-if="editingSocietyId === society.id && editingField === 'name'">
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
                                                <template
                                                    v-if="editingSocietyId === society.id && editingField === 'cap'">
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
                                                <Button @click="deleteSociety(society.id)" variant="destructive"
                                                    size="sm">
                                                    删除
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow v-if="societies.length === 0">
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
                                        <template v-for="society in societies" :key="society.id">
                                            <TableRow>
                                                <TableCell>{{ society.name }}</TableCell>
                                                <TableCell>
                                                    <div class="flex flex-wrap gap-2">
                                                        <div v-for="memberId in society.coreMembers || []"
                                                            :key="memberId" class="relative group">
                                                            <div
                                                                class="bg-amber-100 px-3 py-1 rounded-full text-sm flex items-center relative">
                                                                {{ getUserClassNameById(memberId) }}
                                                                <Button @click="removeCoreMember(society.id, memberId)"
                                                                    class="ml-1 h-4 w-4 p-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity absolute -top-1 -right-1"
                                                                    variant="destructive">
                                                                    ×
                                                                </Button>
                                                            </div>
                                                        </div>

                                                        <!-- 添加核心成员的ComboBox -->
                                                        <Popover>
                                                            <PopoverTrigger as-child>
                                                                <Button variant="outline"
                                                                    class="w-8 h-8 p-0 rounded-full">
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
                                                                                v-for="user in users.filter(u => u.role !== 'teacher')"
                                                                                :key="user.id" :value="user.id"
                                                                                @select="addCoreMember(society.id, user.id)"
                                                                                class="flex items-center">
                                                                                <div class="flex items-center">
                                                                                    <span class="font-medium">{{
                                                                                        user.name }}</span>
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
                                        <TableRow v-if="societies.length === 0">
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
            <CardFooter class="font-bold text-green-600" v-show="societySuccessHint">
                <p>{{ societySuccessHint }}</p>
            </CardFooter>
        </Card>
    </main>
</template>