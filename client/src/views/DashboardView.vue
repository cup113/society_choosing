<script lang="ts" setup>
import { Tabs, TabsTrigger, TabsList, TabsContent } from '@/components/ui/tabs';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { ChevronsUpDown, Check } from 'lucide-vue-next';
import { Command, CommandInput, CommandList, CommandGroup, CommandItem, CommandEmpty } from '@/components/ui/command';
import DashboardTable from '@/components/DashboardTable.vue';

import { ref, computed, onMounted } from 'vue';
import { createReusableTemplate } from '@vueuse/core';
import { useAdmissionStore } from '@/stores/admission';

const admissionStore = useAdmissionStore();
const [UseTemplate, SearchSociety] = createReusableTemplate();

const open = ref(false);
const societyName = ref('');
const className = ref('');
const society = computed(() => admissionStore.societies.find(society => society.name === societyName.value));

const tableReview = computed(() => admissionStore.getTableReview(societyName.value));
const tableResultSocieties = computed(() => admissionStore.getTableResultSocieties(societyName.value));
const tableResultClasses = computed(() => admissionStore.getTableResultClasses(className.value));

onMounted(() => {
  admissionStore.fetchAdmissionResult();
});
</script>

<template>
  <div class="flex flex-col gap-4 w-4xl py-4 mx-auto">
    <UseTemplate>

      <div class="flex items-center gap-2 justify-center">
        <span>选择社团</span>
        <popover v-model:open="open">
          <popover-trigger as-child>
            <Button variant="outline" role="combobox" class="w-3xs justify-between" :aria-expanded="open">
              {{ societyName }}
              <ChevronsUpDown class="ml-2 h-4 w-4 opacity-50" />
            </Button>
          </popover-trigger>
          <popover-content side="top">
            <command v-model="societyName">
              <command-input placeholder="搜索社团名称..."></command-input>
              <command-empty>没有包含该名称的社团。</command-empty>
              <command-list>
                <command-group>
                  <command-item v-for="society in admissionStore.societies" :key="society.id" :value="society.name"
                    @select="open = false">
                    <Check class="mr-2 h-2 w-4" :class="{ 'opacity-0': society.name !== societyName }"></Check>
                    {{ society.name }}
                  </command-item>
                </command-group>
              </command-list>
            </command>
          </popover-content>
        </popover>
      </div>
    </UseTemplate>
    <tabs>
      <tabs-list class="w-full">
        <tabs-trigger value="student-raw-data">学生原始数据</tabs-trigger>
        <tabs-trigger value="society-stat">社团统计数据</tabs-trigger>
        <tabs-trigger value="review">审核退档</tabs-trigger>
        <tabs-trigger value="result-societies">按社团分</tabs-trigger>
        <tabs-trigger value="result-classes">按班级分</tabs-trigger>
      </tabs-list>
      <tabs-content value="student-raw-data">
        <div class="text-center my-4">
          <Button @click="admissionStore.generateExcelOverview()">导出 数据总览.xlsx</Button>
        </div>
        <DashboardTable :data="admissionStore.tableUsers"></DashboardTable>
      </tabs-content>
      <tabs-content value="society-stat">
        <DashboardTable :data="admissionStore.tableSocieties"></DashboardTable>
      </tabs-content>
      <tabs-content value="review">
        <SearchSociety></SearchSociety>
        <DashboardTable :data="tableReview">
          <template #head>退档</template>
          <template #cell="{ row }">
            <Button @click="admissionStore.toggle_reject(row.id, society)" v-if="row.canReject && !row.isRejected"
              type="danger">退档</Button>
            <Button @click="admissionStore.toggle_reject(row.id, society)" v-if="row.canReject && row.isRejected"
              type="success">取消退档</Button>
          </template>
        </DashboardTable>
      </tabs-content>
      <tabs-content value="result-societies">
        <div class="text-center my-4">
          <Button @click="admissionStore.generateExcelSocieties()">导出 按社团分.xlsx</Button>
        </div>
        <SearchSociety></SearchSociety>
        <DashboardTable :data="tableResultSocieties"></DashboardTable>
      </tabs-content>
      <tabs-content value="result-classes">
        <div class="text-center my-4">
          <Button @click="admissionStore.generateExcelClasses()">导出 按班级分.xlsx</Button>
        </div>
        <div class="flex items-center gap-2 justify-center">
          <span>选择班级</span>
          <popover v-model:open="open">
            <popover-trigger as-child>
              <Button variant="outline" role="combobox" class="w-3xs justify-between" :aria-expanded="open">
                {{ className }}
                <ChevronsUpDown class="ml-2 h-4 w-4 opacity-50" />
              </Button>
            </popover-trigger>
            <popover-content side="top">
              <command v-model="className">
                <command-input placeholder="搜索班级名称..."></command-input>
                <command-empty>没有包含该名称的班级。</command-empty>
                <command-list>
                  <command-group>
                    <command-item v-for="_class in admissionStore.classes" :key="_class" :value="_class"
                      @select="open = false">
                      <Check class="mr-2 h-2 w-4" :class="{ 'opacity-0': _class !== className }"></Check>
                      {{ _class }}
                    </command-item>
                  </command-group>
                </command-list>
              </command>
            </popover-content>
          </popover>
        </div>
        <DashboardTable :data="tableResultClasses"></DashboardTable>
      </tabs-content>
    </tabs>
  </div>
</template>
