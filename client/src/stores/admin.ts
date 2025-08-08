import { defineStore } from 'pinia'
import { ref } from 'vue'
import { Fetcher } from '@/lib/fetch'
import { useErrorStore } from '@/stores/error'
import type { User, DatesRecord, Society, ListSocietyResponse } from '../../../types/types'

export const useAdminStore = defineStore('admin', () => {
    const users = ref<User[]>([])
    const userSuccessHint = ref('')

    const currentPage = ref(1)
    const totalPages = ref(1)
    const usersPerPage = ref(20)
    const searchQuery = ref('')
    const filteredUsers = ref<User[]>([])


    const dates = ref<DatesRecord[]>([])
    const dateSuccessHint = ref('')

    const societies = ref<Society[]>([])
    const societySuccessHint = ref('')

    const errorStore = useErrorStore()

    function errorToString(error: unknown): string {
        return error instanceof Error ? error.message : String(error);
    }

    // User management actions
    async function getUsers() {
        try {
            const data = await new Fetcher<User[]>({
                url: '/api/admin/user/list',
                method: 'GET'
            }).fetch_json()
            users.value = data
        } catch (error) {
            errorStore.add_error("获取用户失败：" + errorToString(error))
        }
    }

    async function importUsers(userImportData: string) {
        try {
            if (!userImportData) {
                errorStore.add_error('请粘贴用户数据')
                return
            }

            const lines = userImportData.trim().split('\n')
            if (lines.length < 2) {
                errorStore.add_error('数据格式不正确，至少需要包含表头和一行数据')
                return
            }

            const header = lines[0].split('\t')
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
                    errorStore.add_error(`数据格式错误，缺少列 ${key}`)
                    return
                }
            })

            const usersToAdd = lines.slice(1).map(line => {
                const values = line.split('\t')
                const gender = ["male", "男"].includes(values[indexMap.gender]) ? 'male' : 'female'
                const role = ["teacher", "教师"].includes(values[indexMap.role]) ? 'teacher' : 'student'
                const password = values[indexMap.password] || ''
                return {
                    class: values[indexMap.class] || '',
                    username: values[indexMap.username] || '',
                    password,
                    passwordConfirm: password,
                    name: values[indexMap.name] || '',
                    gender,
                    role,
                }
            })

            const newUsers = await new Fetcher<User[]>({
                url: '/api/admin/user/import',
                method: 'POST',
                data: JSON.stringify(usersToAdd)
            }).fetch_json()

            let totalNewUsers = 0
            let totalModifiedUsers = 0
            newUsers.forEach(newUser => {
                const index = users.value.findIndex(user => user.id === newUser.id)
                if (index !== -1) {
                    users.value[index] = newUser
                    totalModifiedUsers++
                } else {
                    users.value.push(newUser)
                    totalNewUsers++
                }
            })

            userSuccessHint.value = `已成功新建 ${totalNewUsers} 位用户，修改 ${totalModifiedUsers} 位用户。`
        } catch (error: any) {
            errorStore.add_error(`导入失败: ${error.message}`)
        }
    }

    async function deleteUsers(userDeleteClass: string) {
        if (!userDeleteClass) {
            errorStore.add_error('请选择班级')
            return
        }
        try {
            const usersToDelete = users.value.filter(user => user.class === userDeleteClass).map(user => user.id)
            await new Fetcher({
                url: '/api/admin/user/delete',
                method: 'POST',
                data: JSON.stringify(usersToDelete),
            }).fetch_json()
            users.value = users.value.filter(user => user.class !== userDeleteClass)
            userSuccessHint.value = `已成功删除 ${userDeleteClass} 的 ${usersToDelete.length} 位用户。`
        } catch (error: any) {
            errorStore.add_error(`删除失败: ${error.message}`)
        }
    }

    async function updateUser(userId: string, field: string, value: string) {
        try {
            const userToUpdate = users.value.find(user => user.id === userId)
            if (!userToUpdate) {
                throw new Error('未找到要更新的用户')
            }

            // 构造更新数据
            const updateData: Partial<User> = {
                id: userId,
                [field]: value,
            }

            const updatedUser = await new Fetcher<User>({
                url: '/api/admin/user/update',
                method: 'POST',
                data: JSON.stringify(updateData)
            }).fetch_json()

            const index = users.value.findIndex(user => user.id === userId)
            if (index !== -1) {
                users.value[index] = updatedUser
            }

            filterUsers()

            return updatedUser
        } catch (error: any) {
            errorStore.add_error(`更新用户失败: ${error.message}`)
            throw error
        }
    }

    async function deleteUser(userId: string) {
        try {
            await new Fetcher({
                url: '/api/admin/user/delete',
                method: 'POST',
                data: JSON.stringify([userId]),
            }).fetch_json()

            // 从本地列表中移除用户
            users.value = users.value.filter(user => user.id !== userId)

            // 重新过滤用户列表
            filterUsers()
        } catch (error: any) {
            errorStore.add_error(`删除用户失败: ${error.message}`)
            throw error
        }
    }


    // Date management actions
    async function getDates() {
        try {
            const data = await new Fetcher<DatesRecord[]>({
                url: '/api/admin/date/list',
                method: 'GET'
            }).fetch_json()
            dates.value = data
        } catch (error) {
            errorStore.add_error("获取日期失败：" + errorToString(error))
        }
    }

    async function createDate(startDate: string, endDate: string) {
        try {
            if (!startDate || !endDate) {
                errorStore.add_error('请选择开始时间和结束时间')
                return
            }

            const data = {
                start: new Date(startDate).toISOString(),
                end: new Date(endDate).toISOString()
            }

            const result = await new Fetcher<DatesRecord>({
                url: '/api/admin/date/create',
                method: 'POST',
                data: JSON.stringify(data)
            }).fetch_json()

            dates.value.push(result)
            dateSuccessHint.value = `已创建选课活动 ${result.start} - ${result.end}`
        } catch (error: any) {
            errorStore.add_error(`创建选课活动失败: ${error.message}`)
        }
    }

    async function toggleActivateDate(id: string, activate: boolean) {
        try {
            const data = {
                id,
                activate,
            }

            await new Fetcher<DatesRecord>({
                url: '/api/admin/date/activate',
                method: 'POST',
                data: JSON.stringify(data),
            }).fetch_json()

            const index = dates.value.findIndex(date => date.id == id)
            dates.value[index].isActive = activate
            const startDateStr = new Date(dates.value[index].start).toLocaleString()
            dateSuccessHint.value = `成功 ${activate ? '激活' : '取消激活'} 选课活动（开始于 ${startDateStr}）`
        } catch (error) {
            errorStore.add_error(`操作失败: ${errorToString(error)}`)
        }
    }

    // 添加删除日期的方法
    async function deleteDate(id: string) {
        try {
            await new Fetcher({
                url: '/api/admin/date/delete',
                method: 'POST',
                data: JSON.stringify({ id }),
            }).fetch_json()

            dates.value = dates.value.filter(date => date.id !== id)
            dateSuccessHint.value = '已成功删除选课活动'
        } catch (error) {
            errorStore.add_error(`删除失败: ${errorToString(error)}`)
        }
    }

    // 添加更新日期的方法
    async function updateDate(id: string, start: string, end: string) {
        try {
            const data = {
                id,
                start: new Date(start).toISOString(),
                end: new Date(end).toISOString()
            }

            const updatedDate = await new Fetcher<DatesRecord>({
                url: '/api/admin/date/update',
                method: 'POST',
                data: JSON.stringify(data),
            }).fetch_json()

            const index = dates.value.findIndex(date => date.id === id)
            if (index !== -1) {
                dates.value[index] = updatedDate
            }
            dateSuccessHint.value = `已成功更新选课活动 ${updatedDate.start} - ${updatedDate.end}`
        } catch (error) {
            errorStore.add_error(`更新失败: ${errorToString(error)}`)
        }
    }

    // Society management actions
    async function getSocieties() {
        try {
            const data = await new Fetcher<ListSocietyResponse>({
                url: '/api/societies/list',
                method: 'GET'
            }).fetch_json()
            societies.value = data.societies
        } catch (error) {
            errorStore.add_error("获取社团失败：" + errorToString(error))
        }
    }

    async function importSocieties(societyImportData: string) {
        try {
            if (!societyImportData) {
                errorStore.add_error('请粘贴社团数据')
                return
            }

            const lines = societyImportData.trim().split('\n')

            const header = lines[0].split('\t')
            const indexMap = {
                name: header.indexOf('名称'),
                cap: header.indexOf('限额'),
                teacher: header.indexOf('指导教师'),
                description: header.indexOf('描述'),
                limit: header.indexOf('限制'),
            }
            Object.entries(indexMap).forEach(([key, value]) => {
                if (value === -1) {
                    errorStore.add_error(`数据格式错误，缺少列 ${key}`)
                    return
                }
            })

            const societiesToImport = lines.slice(1).map(line => {
                const values = line.split('\t')
                return {
                    name: values[indexMap.name],
                    cap: parseInt(values[indexMap.cap]),
                    teacher: values[indexMap.teacher],
                    description: values[indexMap.description],
                    limit: values[indexMap.limit],
                }
            })

            const newSocieties = await new Fetcher<Society[]>({
                url: '/api/admin/society/import',
                method: 'POST',
                data: JSON.stringify(societiesToImport)
            }).fetch_json()

            let societyCreatedCount = 0
            let societyUpdatedCount = 0
            newSocieties.forEach(society => {
                const index = societies.value.findIndex(soc => soc.id === society.id)
                if (index === -1) {
                    societyCreatedCount++
                    societies.value.push(society)
                } else {
                    societyUpdatedCount++
                    societies.value[index] = society
                }
            })

            societySuccessHint.value = `已成功导入 ${societyCreatedCount} 个社团，更新 ${societyUpdatedCount} 个社团`
        } catch (error: any) {
            errorStore.add_error(`导入失败: ${error.message}`)
        }
    }

    async function updateSocietyField(societyId: string, field: string, value: string | number) {
        try {
            const societyToUpdate = societies.value.find(s => s.id === societyId)
            if (!societyToUpdate) {
                errorStore.add_error('未找到要更新的社团')
                return
            }

            const updateData: Partial<Society> = { ...societyToUpdate }
            updateData[field as keyof Society] = value as never

            const updatedSociety = await new Fetcher<Society>({
                url: '/api/admin/society/update',
                method: 'POST',
                data: JSON.stringify({ id: societyId, [field]: value })
            }).fetch_json()

            const index = societies.value.findIndex(s => s.id === societyId)
            if (index !== -1) {
                societies.value[index] = updatedSociety
            }

            societySuccessHint.value = `已成功更新社团 ${updatedSociety.name} 的 ${field} 字段`
        } catch (error: any) {
            errorStore.add_error(`更新社团失败: ${error.message}`)
        }
    }

    async function deleteSociety(societyId: string) {
        try {
            await new Fetcher({
                url: '/api/admin/society/delete',
                method: 'POST',
                data: JSON.stringify([societyId])
            }).fetch_json()

            societies.value = societies.value.filter(s => s.id !== societyId)
            societySuccessHint.value = '已成功删除社团'
        } catch (error: any) {
            errorStore.add_error(`删除社团失败: ${error.message}`)
        }
    }

    async function addCoreMember(societyId: string, userId: string) {
        try {
            const society = societies.value.find(s => s.id === societyId)
            if (!society) {
                errorStore.add_error('未找到社团')
                return
            }

            const updatedCoreMembers = [...(society.coreMembers || []), userId]

            const updatedSociety = await new Fetcher<Society>({
                url: '/api/admin/society/update',
                method: 'POST',
                data: JSON.stringify({
                    id: societyId,
                    coreMembers: updatedCoreMembers
                })
            }).fetch_json()

            const index = societies.value.findIndex(s => s.id === societyId)
            if (index !== -1) {
                societies.value[index] = updatedSociety
            }

            societySuccessHint.value = `已成功添加核心成员`
        } catch (error: any) {
            errorStore.add_error(`添加核心成员失败: ${error.message}`)
        }
    }

    async function removeCoreMember(societyId: string, userId: string) {
        try {
            const society = societies.value.find(s => s.id === societyId)
            if (!society) {
                errorStore.add_error('未找到社团')
                return
            }

            const updatedCoreMembers = (society.coreMembers || []).filter(id => id !== userId)

            const updatedSociety = await new Fetcher<Society>({
                url: '/api/admin/society/update',
                method: 'POST',
                data: JSON.stringify({
                    id: societyId,
                    coreMembers: updatedCoreMembers
                })
            }).fetch_json()

            const index = societies.value.findIndex(s => s.id === societyId)
            if (index !== -1) {
                societies.value[index] = updatedSociety
            }

            societySuccessHint.value = `已成功移除核心成员`
        } catch (error: any) {
            errorStore.add_error(`移除核心成员失败: ${error.message}`)
        }
    }

    // Utility functions
    function getUserClassNameById(userId: string) {
        const user = users.value.find(u => u.id === userId)
        return user ? `${user.class} ${user.name}` : '未知用户'
    }

    function getClasses() {
        const map = new Map<string, { name: string, count: number }>()
        users.value.filter(user => user.role !== 'teacher').forEach(user => {
            const class_ = user.class
            if (!map.has(class_)) {
                map.set(class_, { name: class_, count: 0 })
            }
            map.get(class_)!.count++
        })
        return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name))
    }

    function setSearchQuery(query: string) {
        searchQuery.value = query
        filterUsers()
    }

    function setCurrentPage(page: number) {
        currentPage.value = page
        filterUsers()
    }

    function filterUsers() {
        // 根据搜索查询过滤用户
        let result = users.value
        if (searchQuery.value) {
            const query = searchQuery.value.toLowerCase()
            result = users.value.filter(user => `${user.name}-${user.class}-${user.username}`.toLowerCase().includes(query))
        }

        // 更新过滤后的用户列表
        filteredUsers.value = result

        // 计算总页数
        totalPages.value = Math.ceil(filteredUsers.value.length / usersPerPage.value)

        // 确保当前页码不超过总页数
        if (currentPage.value > totalPages.value) {
            currentPage.value = totalPages.value || 1
        }
    }

    function getCurrentPageUsers() {
        const start = (currentPage.value - 1) * usersPerPage.value
        const end = start + usersPerPage.value
        return filteredUsers.value.slice(start, end)
    }

    function clearUserSuccessHint() {
        userSuccessHint.value = ''
    }

    function clearDateSuccessHint() {
        dateSuccessHint.value = ''
    }

    function clearSocietySuccessHint() {
        societySuccessHint.value = ''
    }

    return {
        // State
        users,
        userSuccessHint,
        dates,
        dateSuccessHint,
        societies,
        societySuccessHint,
        currentPage,
        totalPages,
        usersPerPage,
        searchQuery,
        filteredUsers,

        // Actions
        getUsers,
        importUsers,
        deleteUsers,
        deleteUser,
        updateUser,
        getDates,
        createDate,
        deleteDate,
        updateDate,
        toggleActivateDate,
        getSocieties,
        importSocieties,
        updateSocietyField,
        deleteSociety,
        addCoreMember,
        removeCoreMember,
        getUserClassNameById,
        getClasses,
        setSearchQuery,
        setCurrentPage,
        filterUsers,
        getCurrentPageUsers,
        clearUserSuccessHint,
        clearDateSuccessHint,
        clearSocietySuccessHint
    }
})