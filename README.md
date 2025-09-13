# Society Choosing 社团选课系统

社团选课系统是一个为学校社团选课设计的完整解决方案，支持学生在线选择社团志愿、教师管理社团和审核选课等功能。

[![Vue.js](https://img.shields.io/badge/Vue.js-3.x-42b883?style=flat-square)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6?style=flat-square)](https://www.typescriptlang.org/)
[![PocketBase](https://img.shields.io/badge/PocketBase-0.29.x-ff6b6b?style=flat-square)](https://pocketbase.io/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ed?style=flat-square)](https://www.docker.com/)

## 项目概述

该系统基于现代Web技术栈构建，包括：

- 前端：Vue 3 + TypeScript + TailwindCSS
- 后端：Node.js + Express
- 数据库：PocketBase（集成了认证、数据库和实时功能）
- 部署：Docker Compose

## 功能特性

### 学生功能

- 在线浏览所有社团信息
- 提交三个志愿选择，可修改（多处）源代码进行调整
- 回答社团特定问题
- 实时查看选课状态

### 教师功能

- 导出选课数据
- 审核学生志愿
- 管理社团信息
- 设置选课时间窗口

### 系统特色

- 响应式设计，支持PC和移动端
- 实时状态更新，无需手动刷新
- 基于角色的权限控制（学生/教师）
- 数据持久化存储
- Docker 容器化部署
- 完整的 TypeScript 类型支持

## 环境要求

### 开发环境

- Node.js >= 22
- Python >= 3.9
- pnpm >= 10

### 生产环境

- 支持 Docker 和 Docker Compose 的服务器

## 快速开始

### 开发环境启动

1. 克隆项目
```bash
git clone <项目地址>
cd society_choosing
```

2. 复制并配置环境变量
```bash
cp .env.example .env
```
然后编辑 `.env` 文件，填写必要的配置项

3. 安装依赖
```bash
# 根目录
pnpm install

# 客户端
cd client
pnpm install
cd ..

# 服务端
cd server
pnpm install
cd ..
```

4. 启动开发服务器
```bash
python run_dev.py
```

### 生产环境部署

使用Docker Compose部署：

```bash
docker-compose up -d
```

这将启动两个服务：

- [express](./Dockerfile.express): 前端和API服务 (端口 4127)
- [pocketbase](./Dockerfile.pocketbase): 数据库和认证服务 (端口 4128)

#### 部署前配置

1. 复制并配置环境变量
```bash
cp .env.example .env
```

需要配置的环境变量包括：
- `admin_email` 和 `admin_password`: 管理员账户信息
- `PB_TYPEGEN_URL`: PocketBase地址 (生产环境通常为 `http://pocketbase:4128`)
- `PB_TYPEGEN_EMAIL` 和 `PB_TYPEGEN_PASSWORD`: 与管理员账户相同

2. 构建项目

```bash
docker-compose build
```

3. 启动服务

```bash
docker-compose up -d
```

4. 初始化数据库

前往 pocketbase 管理面板创建管理员账号，在其中注册一个教师账户，以便后续操作。

## 项目结构

```
.
├── client/                 # 前端Vue应用
│   ├── src/
│   │   ├── assets/         # 静态资源
│   │   ├── components/     # Vue组件
│   │   │   ├── ui/         # UI组件库
│   │   │   └── *.vue       # 业务组件
│   │   ├── views/          # 页面视图
│   │   ├── stores/         # 状态管理(Pinia)
│   │   ├── router/         # 路由配置
│   │   ├── lib/            # 工具库
│   │   └── main.ts         # 应用入口
│   └── ...
├── server/                 # 后端Express服务
│   ├── routes/             # API路由
│   ├── services/           # 业务逻辑服务
│   └── ...
├── db/                     # 数据库迁移文件
│   └── pb_migrations/
├── types/                  # TypeScript类型定义
├── Dockerfile.express      # 前端和API服务Docker配置
├── Dockerfile.pocketbase   # 数据库服务Docker配置
├── docker-compose.yml      # Docker编排配置
└── run_dev.py              # 开发环境启动脚本
```

## 核心概念

### 用户角色

- **学生**: 可以浏览社团、提交志愿选择
- **教师**: 可以管理社团、导出数据、审核志愿

### 社团数据结构

- 名称、限额
- 核心成员、指导教师
- 选课限制条件
- 特定问题（可选）

## 用户选课全流程

### 1. 登录与首页访问

- 学生访问首页 (`/`)，显示登录状态和选课历史
- 未登录用户显示登录表单，已登录用户显示欢迎信息
- 如果已有选课记录，显示历史信息并提示无需重复选课

### 2. 选课页面 (`/choose`)

- **社团浏览**: 显示所有社团列表和已收藏社团
- **志愿选择**: 通过下拉选择框选择三个志愿（第一、第二、第三志愿）
- **表单验证**:
  - 检查是否选择了所有三个志愿
  - 验证志愿不能重复
  - 如果有社团特定问题，必须填写答案
- **提交确认**: 弹出确认对话框显示选择的志愿

### 3. 提交处理

- 通过 POST `/api/choose` 提交选课数据
- 数据格式: `{ choices: [志愿1ID, 志愿2ID, 志愿3ID], answers: "问题答案" }`
- 提交成功后跳转到感谢页面 (`/thanks`)

### 4. 感谢页面

- 显示提交成功信息
- 5秒倒计时后自动跳转回首页
- 提供手动返回按钮

### 5. 状态管理

- 使用 Pinia stores 管理用户状态、社团数据、时间状态
- 实时检查选课时间窗口是否开放
- 支持响应式设计，移动端有折叠表单功能

## 录取算法详解

### 录取流程概述

系统采用多轮录取算法，确保公平性和效率：

1. **数据准备**: 将原始用户和社团数据转换为录取专用数据结构
2. **三轮志愿录取**: 按志愿顺序依次录取
3. **调剂录取**: 对未被录取的学生进行调剂分配
4. **结果输出**: 生成完整的录取结果

### 核心数据结构

#### AdmittedUser (录取用户)

```typescript
interface AdmittedUser {
  id: string;           // 用户ID
  number: string;       // 学号
  name: string;         // 姓名
  class: string;        // 班级
  gender: string;       // 性别
  society: AdmittedSociety | null;  // 录取社团
  choices: AdmittedSociety[];       // 志愿列表
  rejects: AdmittedSociety[];       // 拒绝社团列表
  batch: number | "adjust" | "core" | "not-admitted" | "not-full";  // 录取批次
  answer?: string;      // 问题答案
  submit: number;       // 提交时间（相对于开始时间的毫秒数）
}
```

#### AdmittedSociety (录取社团)

```typescript
interface AdmittedSociety {
  id: string;           // 社团ID
  name: string;         // 社团名称
  cap: number;          // 容量限制
  coreMembers: string[]; // 核心成员ID列表
  countMembers: number;  // 当前成员数
  location: string;      // 活动地点
  adjustThreshold: number; // 调剂阈值
  lastBatch: string;     // 最后录取批次
  lastTime: number | null; // 最后录取时间
}
```

### 录取算法步骤

#### 1. 三轮志愿录取 (`admit_choice`)

- **处理顺序**: 按志愿批次顺序（0, 1, 2）依次处理
- **排序规则**:
  - 核心成员优先录取
  - 非核心成员按提交时间先后排序（先提交优先）
- **录取条件**: 社团未满额且用户未被该社团拒绝

#### 2. 调剂录取 (`admit_adjust`)

- **处理对象**: 前三轮未被录取的学生
- **排序规则**: 按提交时间倒序（后提交的学生优先调剂）
- **社团选择**: 使用优先队列选择最"冷门"的社团：
  - 首先比较调剂阈值（threshold低的优先）
  - 阈值相同时，比较当前满员比例（比例低的优先）
- **分配逻辑**: 将学生分配到最需要成员的社团

#### 3. 特殊处理

- **核心成员保障**: 核心成员在其志愿社团中享有最高优先级
- **时间戳记录**: 记录每个社团满员时的批次和时间
- **拒绝机制**: 支持社团拒绝特定学生的功能

### 公平性保障

1. **时间优先**: 在同一优先级内，先提交的学生优先录取
2. **核心成员优先**: 保障社团核心成员的录取权益
3. **调剂优化**: 确保社团资源得到充分利用
4. **透明度**: 完整的录取批次和时间记录

### 性能考虑
- 使用 Map 数据结构快速查找社团信息
- 优先队列优化调剂分配过程
- 批量处理减少重复计算

这个算法在保证公平性的同时，充分考虑了社团运营需求和用户体验，是一个实用且高效的选课录取解决方案。

## 故障排除

### 常见问题

1. **前台报错**
   主要原因可能是未将 ACTIVITY_ID 添加到数据库中，请登录数据库管理员账号手动添加。

2. **无法连接到 PocketBase**
   检查 `.env` 文件中的 `PB_TYPEGEN_URL` 配置是否正确，开发环境通常为 `http://localhost:4128`。

3. **Docker 部署失败**
   确保已正确配置所有环境变量，并且端口未被其他服务占用。

## 贡献指南

欢迎提交 Issue 和 Pull Request 来改进这个项目。

## 许可证

本项目采用 MIT 许可证，详见 [LICENSE.md](./LICENSE.md) 文件。
