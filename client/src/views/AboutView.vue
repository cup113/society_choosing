<script lang="ts" setup>
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import router from '@/router/index';
import { ArrowLeftIcon, UsersIcon, ServerIcon, CodeIcon } from 'lucide-vue-next';

function go_home() {
  router.push('/');
}
</script>

<template>
  <div class="flex flex-col gap-y-6 max-w-4xl mx-auto my-8 p-4">
    <div class="flex items-center gap-4 mb-2">
      <Button @click="go_home" variant="outline" size="sm" class="flex items-center gap-2">
        <ArrowLeftIcon class="w-4 h-4" />
        返回主页
      </Button>
      <h1 class="text-3xl font-bold text-amber-800">关于我们</h1>
    </div>

    <Card class="border-2 border-amber-200 shadow-lg bg-gradient-to-br from-amber-50 to-white">
      <CardHeader class="rounded-t-lg">
        <CardTitle class="flex items-center gap-2 text-amber-800">
          <UsersIcon class="w-6 h-6" />
          贡献者 / Contributors
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul class="space-y-2">
          <li class="flex flex-col sm:flex-row sm:items-center gap-2 py-2 border-b border-amber-100 last:border-0">
            <span class="font-medium w-32 text-amber-700">前后端程序开发:</span>
            <Badge variant="secondary" class="bg-amber-500 text-white px-3 py-1">
              2604 李牧
            </Badge>
          </li>
          <li class="flex flex-col sm:flex-row sm:items-center gap-2 py-2 border-b border-amber-100 last:border-0">
            <span class="font-medium w-32 text-amber-700">UI 设计 / 绘画:</span>
            <Badge variant="secondary" class="bg-amber-500 text-white px-3 py-1">
              2604 罗睿淇
            </Badge>
          </li>
          <li class="flex flex-col sm:flex-row sm:items-center gap-2 py-2 border-b border-amber-100 last:border-0">
            <span class="font-medium w-32 text-amber-700">需求沟通:</span>
            <div class="flex flex-wrap gap-2">
              <Badge variant="outline" class="border-amber-300 text-amber-700">
                金典（老师）
              </Badge>
              <Badge variant="outline" class="border-amber-300 text-amber-700">
                王玉璇（老师）
              </Badge>
            </div>
          </li>
        </ul>
      </CardContent>
    </Card>

    <Card class="border-2 border-amber-200 shadow-lg bg-gradient-to-br from-amber-50 to-white">
      <CardHeader class="rounded-t-lg">
        <CardTitle class="flex items-center gap-2 text-amber-800">
          <ServerIcon class="w-6 h-6" />
          服务 / Services
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul class="space-y-2">
          <li class="flex flex-col sm:flex-row sm:items-center gap-2 py-2 border-b border-amber-100 last:border-0">
            <span class="font-medium w-32 text-amber-700">云服务器:</span>
            <span class="text-gray-700">华为云 Flexus L</span>
          </li>
          <li class="flex flex-col sm:flex-row sm:items-center gap-2 py-2 border-b border-amber-100 last:border-0">
            <span class="font-medium w-32 text-amber-700">资金支持:</span>
            <span class="text-gray-700">华东师范大学第二附属中学（宝山校区）</span>
          </li>
        </ul>
      </CardContent>
    </Card>

    <Card class="border-2 border-amber-200 shadow-lg bg-gradient-to-br from-amber-50 to-white">
      <CardHeader class="rounded-t-lg">
        <CardTitle class="flex items-center gap-2 text-amber-800">
          <CodeIcon class="w-6 h-6" />
          第三方库 / Third-party libraries
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="space-y-3">
            <div class="flex flex-col gap-2 py-2 border-b border-amber-100 last:border-0">
              <span class="font-medium text-amber-700">部署工具</span>
              <span class="text-gray-700 bg-amber-50 px-3 py-2 rounded">Coolify (Docker Compose)</span>
            </div>
            <div class="flex flex-col gap-2 py-2 border-b border-amber-100 last:border-0">
              <span class="font-medium text-amber-700">前后端框架</span>
              <span class="text-gray-700 bg-amber-50 px-3 py-2 rounded">Vue 3 (Vite), Express.js</span>
            </div>
            <div class="flex flex-col gap-2 py-2 border-b border-amber-100 last:border-0">
              <span class="font-medium text-amber-700">UI 框架</span>
              <span class="text-gray-700 bg-amber-50 px-3 py-2 rounded">shadcn-vue</span>
            </div>
          </div>
          <div class="space-y-3">
            <div class="flex flex-col gap-2 py-2 border-b border-amber-100 last:border-0">
              <span class="font-medium text-amber-700">数据库系统</span>
              <span class="text-gray-700 bg-amber-50 px-3 py-2 rounded">PocketBase</span>
            </div>
            <div class="flex flex-col gap-2 py-2 border-b border-amber-100 last:border-0">
              <span class="font-medium text-amber-700">工具库</span>
              <span class="text-gray-700 bg-amber-50 px-3 py-2 rounded">TailwindCSS, vueuse, vue-router, clsx,
                priority-queue, winston, xlsx</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>