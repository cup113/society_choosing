<script lang="ts" setup>
import { Tabs, TabsTrigger, TabsList, TabsContent } from '@/components/ui/tabs';
import { ref, computed, onMounted } from 'vue';
import { useAdmissionStore } from '@/stores/admission';
import DashboardTable from '@/components/DashboardTable.vue';
import SearchSociety from '@/components/SearchSociety.vue';
import SearchClass from '@/components/SearchClass.vue';
import ButtonExport from '@/components/ButtonExport.vue';

const admissionStore = useAdmissionStore();

const societyName = ref('');
const society = computed(() => admissionStore.societies.find(s => s.name === societyName.value));
const className = ref('');

const tableReview = computed(() => admissionStore.getTableReview(societyName.value));
const tableResultSocieties = computed(() => admissionStore.getTableResultSocieties(societyName.value));
const tableResultClasses = computed(() => admissionStore.getTableResultClasses(className.value));

onMounted(() => {
  admissionStore.fetchAdmissionResult();
});
</script>

<template>
  <div class="flex flex-col gap-6 w-full max-w-7xl py-6 mx-auto px-4">
    <div class="text-center mb-2">
      <h1 class="text-3xl font-bold text-amber-800">数据总览</h1>
      <p class="text-amber-600 mt-2">查看和管理选课数据</p>
    </div>

    <Tabs default-value="student-raw-data" class="w-full">
      <TabsList class="grid w-full grid-cols-5 bg-amber-100 p-1 rounded-xl">
        <TabsTrigger value="student-raw-data"
          class="data-[state=active]:bg-amber-600 data-[state=active]:text-white rounded-lg transition-all">
          学生原始数据
        </TabsTrigger>
        <TabsTrigger value="society-stat"
          class="data-[state=active]:bg-amber-600 data-[state=active]:text-white rounded-lg transition-all">
          社团统计数据
        </TabsTrigger>
        <TabsTrigger value="review"
          class="data-[state=active]:bg-amber-600 data-[state=active]:text-white rounded-lg transition-all">
          审核退档
        </TabsTrigger>
        <TabsTrigger value="result-societies"
          class="data-[state=active]:bg-amber-600 data-[state=active]:text-white rounded-lg transition-all">
          按社团分
        </TabsTrigger>
        <TabsTrigger value="result-classes"
          class="data-[state=active]:bg-amber-600 data-[state=active]:text-white rounded-lg transition-all">
          按班级分
        </TabsTrigger>
      </TabsList>

      <TabsContent value="student-raw-data" class="mt-6">
        <div class="flex justify-center">
          <ButtonExport :on-click="admissionStore.generateExcelOverview" filename="数据总览.xlsx" />
        </div>
        <div class="bg-white rounded-xl shadow-lg border border-amber-200 overflow-hidden">
          <DashboardTable :data="admissionStore.tableUsers" />
        </div>
      </TabsContent>

      <TabsContent value="society-stat" class="mt-6">
        <div class="bg-white rounded-xl shadow-lg border border-amber-200 overflow-hidden">
          <DashboardTable :data="admissionStore.tableSocieties" />
        </div>
      </TabsContent>

      <TabsContent value="review" class="mt-6">
        <div class="mb-6">
          <SearchSociety v-model="societyName" :societies="admissionStore.societies" placeholder="搜索社团名称..." />
        </div>
        <div class="bg-white rounded-xl shadow-lg border border-amber-200 overflow-hidden">
          <DashboardTable :data="tableReview">
            <template #head>退档</template>
            <template #cell="{ row }">
              <button @click="admissionStore.toggle_reject(row.id, society)"
                class="px-3 py-1 rounded-lg text-sm font-medium transition-colors" :class="{
                  'bg-red-500 hover:bg-red-600 text-white': row.canReject && !row.isRejected,
                  'bg-green-500 hover:bg-green-600 text-white': row.canReject && row.isRejected
                }">
                {{ row.isRejected ? '取消退档' : '退档' }}
              </button>
            </template>
          </DashboardTable>
        </div>
      </TabsContent>

      <TabsContent value="result-societies" class="mt-6">
        <div class="flex justify-center">
          <ButtonExport :on-click="admissionStore.generateExcelSocieties" filename="按社团分.xlsx" />
        </div>
        <div class="mb-6">
          <SearchSociety v-model="societyName" :societies="admissionStore.societies" placeholder="搜索社团名称..." />
        </div>
        <div class="bg-white rounded-xl shadow-lg border border-amber-200 overflow-hidden">
          <DashboardTable :data="tableResultSocieties" />
        </div>
      </TabsContent>

      <TabsContent value="result-classes" class="mt-6">
        <div class="flex justify-center">
          <ButtonExport :on-click="admissionStore.generateExcelClasses" filename="按班级分.xlsx" />
        </div>
        <div class="mb-6">
          <SearchClass v-model="className" :classes="admissionStore.classes" placeholder="搜索班级名称..." />
        </div>
        <div class="bg-white rounded-xl shadow-lg border border-amber-200 overflow-hidden">
          <DashboardTable :data="tableResultClasses" />
        </div>
      </TabsContent>
    </Tabs>
  </div>
</template>