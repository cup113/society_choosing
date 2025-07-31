<script lang="ts" setup>
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
</script>

<template>
    <main class="flex flex-col w-2xl mx-auto gap-4 py-4">
        <Card class="w-full">
            <CardHeader>
                <CardTitle>用户管理</CardTitle>
                <CardDescription>从 Excel 批量导入用户；按班级批量删除用户</CardDescription>
            </CardHeader>
            <CardContent>
                <div class="flex flex-col gap-8">
                    <section>
                        <p>从 Excel 文件复制后粘贴到以下输入框。表头：班级、学号、姓名、性别、角色。</p>
                        <Textarea></Textarea>
                        <Button>导入 #TODO</Button>
                    </section>
                    <section>
                        <p>请选取需要删除的班级的学生</p>
                        TODO
                        <Button variant="destructive">删除</Button>
                    </section>
                </div>
            </CardContent>
        </Card>
        <Card class="w-full">
            <CardHeader>
                <CardTitle>选课管理</CardTitle>
                <CardDescription>添加选课活动；指定当前选课活动</CardDescription>
            </CardHeader>
            <CardContent>
                <div class="flex flex-col gap-8">
                    <section class="flex items-center gap-4">
                        <div class="flex flex-col gap-4 grow">
                            <Label>
                                <span class="inline-block w-32">选课开始时间</span>
                                <Input type="datetime-local" />
                            </Label>
                            <Label>
                                <span class="inline-block w-32">选课结束时间</span>
                                <Input type="datetime-local" />
                            </Label>
                        </div>
                        <Button>创建 #TODO</Button>
                    </section>
                    <section>
                        当前活动 #TODO 激活
                    </section>
                </div>
            </CardContent>
        </Card>
        <Card class="w-full">
            <CardHeader>
                <CardTitle>社团管理</CardTitle>
                <CardDescription>从 Excel 批量导入社团；修改社团信息；删除社团；管理社团核心成员</CardDescription>
            </CardHeader>
            <CardContent>
                <div class="flex flex-col gap-8">
                    <section>
                        <p>从 Excel 文件复制后粘贴到以下输入框。表头：名称、限额、指导教师、描述、限制。</p>
                        <Textarea></Textarea>
                        <Button>导入 #TODO</Button>
                    </section>
                    <section>
                        <p>修改社团信息（名称、限额、指导教师、描述、限制、问题、调剂门槛）#TODO</p>
                    </section>
                    <section>
                        <p>删除社团 #TODO</p>
                    </section>
                    <section>
                        <p>管理社团核心成员 #TODO</p>
                    </section>
                </div>
            </CardContent>
        </Card>
    </main>
</template>
