<script lang="ts" setup>
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell, TableCaption } from '@/components/ui/table';
import { Tabs, TabsTrigger, TabsList, TabsContent } from '@/components/ui/tabs';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { ChevronsUpDown, Check } from 'lucide-vue-next';
import { Command, CommandInput, CommandList, CommandGroup, CommandItem, CommandEmpty } from '@/components/ui/command';

import { Fetcher } from '@/lib/fetch';
import { ref, reactive, computed, onMounted } from 'vue';
import type { AdmissionResult, AdmittedSociety, AdmittedUser, Batch } from '../../../types/types.d.ts';

const admissionResult = reactive<AdmissionResult>({
  users: [],
  societies: [],
});

const societyName = ref('');
const className = ref('');
const open = ref(false);
const classes = computed(() => {
  return new Set<string>(admissionResult.users.map(user => user.class));
})

function batch_to_number(batch: Batch) {
  if (batch === 'core') {
    return 0;
  } else if (typeof batch === 'number') {
    return batch + 1;
  } else if (batch === 'adjust') {
    return 1000;
  } else if (batch === 'not-admitted') {
    return 1001;
  } else if (batch === 'not-full') {
    return 1002;
  } else {
    throw new Error(`Invalid batch ${batch}`);
  }
}

function batch_to_string(batch: Batch) {
  if (batch === 'core') {
    return '核心成员';
  } else if (typeof batch === 'number') {
    return `第 ${batch + 1} 志愿`;
  } else if (batch === 'adjust') {
    return '调剂';
  } else if (batch === 'not-admitted') {
    return '未录取';
  } else if (batch === 'not-full') {
    return '未满';
  } else {
    throw new Error(`Invalid batch ${batch}`);
  }
}

onMounted(() => {
  new Fetcher<AdmissionResult>({
    url: '/api/review/dashboard',
    method: 'GET',
  }).fetch_json().then(data => {
    admissionResult.users = data.users;
    admissionResult.societies = data.societies;
  })
});

const tableUsers = computed(() => {
  return admissionResult.users.sort((a, b) => a.submit - b.submit).map(user => {
    const submitDisplay = (user.submit / 1000).toFixed(3)
    return {
      class: user.class,
      name: user.name,
      society: user.society?.name ?? "未录取",
      submit: submitDisplay,
      choices: [
        user.choices?.[0]?.name ?? "未选择",
        user.choices?.[1]?.name ?? "未选择",
        user.choices?.[2]?.name ?? "未选择",
      ],
    }
  });
});

const tableSocieties = computed(() => {
  return admissionResult.societies.map(society => {
    const choicesApplicant = [0, 1, 2].map(index => admissionResult.users.filter(user => user.choices[index]?.name === society.name).length);
    const choicesAdmit = [0, 1, 2].map(index => admissionResult.users.filter(user => user.choices[index]?.name === society.name && user.society?.name === society.name).length);
    const choicesAdmitSum = choicesAdmit.reduce((acc, val) => acc + val, 0);

    return {
      name: society.name,
      cap: society.cap,
      countMembers: society.countMembers,
      sourcesAdmitStr: [
        society.coreMembers.length,
        ...choicesAdmit,
        society.countMembers - society.coreMembers.length - choicesAdmitSum,
      ].map(n => n.toString()).join("+"),
      choicesStr: choicesApplicant.map(n => n.toString()).join("+"),
      lastBatch: society.lastBatch,
      lastTime: society.lastTime,
    }
  })
});

const tableReview = computed(() => {
  const society = admissionResult.societies.find(society => society.name === societyName.value);
  if (society === undefined) {
    return [];
  }
  return admissionResult.users.filter(user => {
    if (!user.society) {
      return false;
    }
    if (user.society.id === society.id) {
      return true;
    }
    if (user.rejects.some(reject => reject.id === society.id)) {
      return true; // should be given another chance
    }
    if (user.choices.some(choice => choice.id === society.id)) {
      // If a user could have been admitted to the society, but was placed later, they should be given a second chance.
      const batch_diff = batch_to_number(user.batch) - batch_to_number(society.lastBatch);
      if (batch_diff !== 0) {
        return batch_diff > 0;
      } else {
        return society.lastTime && user.submit > society.lastTime;
      }
    }
  }).sort((a, b) => {
    if (a.batch !== b.batch) {
      return batch_to_number(a.batch) - batch_to_number(b.batch);
    }
    return a.submit - b.submit;
  }).map(student => {
    const choiceBatch = student.batch === 'core' ? batch_to_string(student.batch) : batch_to_string(
      student.choices[0]?.id === society.id ? 0 : (
        student.choices[1]?.id === society.id ? 1 : (
          student.choices[2]?.id === society.id ? 2 : 'adjust'
        )
      )
    );
    return {
      batch: choiceBatch,
      name: student.name,
      admittedSociety: student.society?.name,
      answer: student.answer,
      id: student.id,
      canReject: student.batch !== 'adjust' && student.batch !== 'core',
      isRejected: student.rejects.some(_society => society.id === _society.id),
      student,
      society,
      submit: student.submit
    }
  })
});

const tableResultSocieties = computed(() => {
  const society = admissionResult.societies.find(society => society.name === societyName.value);
  if (!society) {
    return [];
  }

  return admissionResult.users.filter(user => user.society?.id === society.id).sort((a, b) => {
    return parseInt(a.number) - parseInt(b.number);
  }).map((user, i) => {
    return {
      no: i + 1,
      id: user.id,
      class: user.class,
      name: user.name,
    };
  });
});

const tableResultClasses = computed(() => {
  return admissionResult.users
    .filter(user => user.class === className.value)
    .sort((a, b) => parseInt(a.number) - parseInt(b.number))
    .map(user => {
      return {
        id: user.id,
        number: user.number,
        name: user.name,
        society: user.society?.name ?? "未录取",
      };
    })
});

function toggle_reject(user: AdmittedUser, society: AdmittedSociety) {
  const targetReject = !user.rejects.some(reject => reject.id == society.id);
  new Fetcher<void>({
    url: `/api/review/toggle?reject`,
    method: "POST",
    data: JSON.stringify({
      reject: targetReject,
      userID: user.id,
      societyID: society.id,
    })
  }).fetch_json().then(() => {
    if (targetReject) {
      user.rejects.push(society);
    } else {
      user.rejects.splice(user.rejects.findIndex(reject => reject.id == society.id), 1)
    }
  })
}

</script>

<template>
  <div class="flex flex-col gap-4 w-4xl py-4 mx-auto">
    <tabs>
      <tabs-list class="w-full">
        <tabs-trigger value="student-raw-data">学生原始数据</tabs-trigger>
        <tabs-trigger value="society-stat">社团统计数据</tabs-trigger>
        <tabs-trigger value="review">审核退档</tabs-trigger>
        <tabs-trigger value="result-societies">按社团分</tabs-trigger>
        <tabs-trigger value="result-classes">按班级分</tabs-trigger>
      </tabs-list>
      <tabs-content value="student-raw-data">
        <Table>
          <table-header>
            <table-row>
              <table-head>班级</table-head>
              <table-head>姓名</table-head>
              <table-head>录取社团</table-head>
              <table-head>选课时间</table-head>
              <table-head>第一志愿</table-head>
              <table-head>第二志愿</table-head>
              <table-head>第三志愿</table-head>
            </table-row>
          </table-header>
          <table-body>
            <table-row v-for="user in tableUsers">
              <table-cell>{{ user.class }}</table-cell>
              <table-cell>{{ user.name }}</table-cell>
              <table-cell>{{ user.society }}</table-cell>
              <table-cell>{{ user.submit }}</table-cell>
              <table-cell>{{ user.choices[0] }}</table-cell>
              <table-cell>{{ user.choices[1] }}</table-cell>
              <table-cell>{{ user.choices[2] }}</table-cell>
            </table-row>
          </table-body>
          <table-caption>学生原始数据</table-caption>
        </Table>
      </tabs-content>
      <tabs-content value="society-stat">
        <Table>
          <table-header>
            <table-row>
              <table-head>社团名称</table-head>
              <table-head>限额</table-head>
              <table-head>实录人数</table-head>
              <table-head>各批次录取人数</table-head>
              <table-head>各批次报名人数</table-head>
              <table-head>志愿线</table-head>
              <table-head>时间线</table-head>
            </table-row>
          </table-header>
          <table-body>
            <table-row v-for="society in tableSocieties">
              <table-cell>{{ society.name }}</table-cell>
              <table-cell>{{ society.cap }}</table-cell>
              <table-cell>{{ society.countMembers }}</table-cell>
              <table-cell>{{ society.sourcesAdmitStr }}</table-cell>
              <table-cell>{{ society.choicesStr }}</table-cell>
              <table-cell>{{ society.lastBatch }}</table-cell>
              <table-cell>{{ society.lastTime ?? '/' }}</table-cell>
            </table-row>
          </table-body>
          <table-caption>社团统计数据</table-caption>
        </Table>
      </tabs-content>
      <tabs-content value="review">
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
                    <command-item v-for="society in admissionResult.societies" :key="society.id" :value="society.name"
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
        <Table>
          <table-header>
            <table-row>
              <table-head>学生</table-head>
              <table-head>志愿</table-head>
              <table-head>提交时间</table-head>
              <table-head>拟录取</table-head>
              <table-head>回答</table-head>
              <table-head>操作</table-head>
            </table-row>
          </table-header>
          <table-body>
            <table-row v-for="student in tableReview" :key="student.id">
              <table-cell>{{ student.name }}</table-cell>
              <table-cell>{{ student.batch }}</table-cell>
              <table-cell>{{ student.submit }}</table-cell>
              <table-cell>{{ student.admittedSociety }}</table-cell>
              <table-cell>{{ student.answer }}</table-cell>
              <table-cell>
                <Button @click="toggle_reject(student.student, student.society)"
                  v-if="student.canReject && !student.isRejected" type="danger">退档</Button>
                <Button @click="toggle_reject(student.student, student.society)"
                  v-if="student.canReject && student.isRejected" type="success">取消退档</Button>
              </table-cell>
            </table-row>
          </table-body>
          <table-caption>审核</table-caption>
        </Table>
      </tabs-content>
      <tabs-content value="result-societies">
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
                    <command-item v-for="society in admissionResult.societies" :key="society.id" :value="society.name"
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
        <Table>
          <table-header>
            <table-row>
              <table-head>编号</table-head>
              <table-head>班级</table-head>
              <table-head>姓名</table-head>
            </table-row>
          </table-header>
          <table-body>
            <table-row v-for="user in tableResultSocieties" :key="user.id">
              <table-cell>{{ user.no }}</table-cell>
              <table-cell>{{ user.class }}</table-cell>
              <table-cell>{{ user.name }}</table-cell>
            </table-row>
          </table-body>
          <table-caption>按社团分</table-caption>
        </Table>
      </tabs-content>
      <tabs-content value="result-classes">
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
                    <command-item v-for="_class in classes" :key="_class" :value="_class" @select="open = false">
                      <Check class="mr-2 h-2 w-4" :class="{ 'opacity-0': _class !== className }"></Check>
                      {{ _class }}
                    </command-item>
                  </command-group>
                </command-list>
              </command>
            </popover-content>
          </popover>
        </div>
        <Table>
          <table-header>
            <table-row>
              <table-head>姓名</table-head>
              <table-head>学号</table-head>
              <table-head>录取社团</table-head>
            </table-row>
          </table-header>
          <table-body>
            <table-row v-for="user in tableResultClasses" :key="user.id">
              <table-cell>{{ user.name }}</table-cell>
              <table-cell>{{ user.number }}</table-cell>
              <table-cell>{{ user.society }}</table-cell>
            </table-row>
          </table-body>
          <table-caption>按班级分</table-caption>
        </Table>
      </tabs-content>
    </tabs>
  </div>
</template>
