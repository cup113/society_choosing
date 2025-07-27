# Society Choosing 社团选课系统

社团选课系统是一个为学校社团选课设计的完整解决方案，支持学生在线选择社团志愿、教师管理社团和审核选课等功能。

## 项目概述

该系统基于现代Web技术栈构建，包括：
- 前端：Vue 3 + TypeScript + TailwindCSS
- 后端：Node.js + Express
- 数据库：PocketBase（集成了认证、数据库和实时功能）
- 部署：Docker Compose

## 功能特性

### 学生功能

- 在线浏览所有社团信息
- 提交三个志愿选择（#TODO 修改）
- 回答社团特定问题
- 实时查看选课状态

### 教师功能

- 管理社团信息（增删改查）
- 导出选课数据
- 审核学生志愿
- 设置选课时间窗口

### 系统特色

- 响应式设计，支持PC和移动端
- 实时状态更新，无需手动刷新
- 权限控制（学生/教师）
- 数据持久化存储
- Docker容器化部署

## 环境要求

### 开发环境

- Node.js >= 22
- Python >= 3.9
- pnpm >= 10

### 生产环境

- 支持Docker的服务器

## 快速开始

### 开发环境启动

1. 克隆项目
```bash
git clone <项目地址>
cd society_choosing
```

2. 安装依赖
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

3. 启动开发服务器
```bash
python run_dev.py
```

### 生产环境部署

使用Docker Compose部署：

```bash
docker-compose up -d
```

这将启动两个服务：
- `express`: 前端和API服务 (端口 4127)
- `pocketbase`: 数据库和认证服务 (端口 4128)

## 项目结构

```
.
├── client/                 # 前端Vue应用
│   ├── src/
│   │   ├── components/     # Vue组件
│   │   ├── views/          # 页面视图
│   │   ├── stores/         # 状态管理(Pinia)
│   │   └── router/         # 路由配置
│   └── ...
├── server/                 # 后端Express服务
│   ├── src/
│   │   └── script/         # 管理脚本
│   └── ...
├── db/                     # 数据库迁移文件
│   └── pb_migrations/
├── types/                  # TypeScript类型定义
└── ...
```

## 核心概念

### 用户角色

- **学生**: 可以浏览社团、提交志愿选择
- **教师**: 可以管理社团、导出数据、审核志愿

### 社团数据结构

- 名称、描述、容量
- 核心成员、指导教师
- 选课限制条件
- 特定问题（可选）

### 选课流程
1. 系统开放选课时间窗口
2. 学生登录并提交三个志愿
3. 系统根据规则分配社团
4. 教师审核并导出结果

## 管理命令

```bash
# 初始化数据库
pnpm run init-data

# 执行分配算法
pnpm run allocate

# 启动PocketBase
pnpm run pocket      # Linux/Mac
pnpm run pocket-win  # Windows
```

## 配置说明

### 环境变量

创建 `.env` 文件参考 `.env.example` 文件配置。

## 故障排除

### 常见问题

1. **无法连接到数据库**
   - 检查PocketBase是否正常运行
   - 确认端口配置正确

2. **前端页面空白**
   - 检查API连接配置
   - 查看浏览器控制台错误信息

## 贡献指南

1. Fork 项目
2. 创建功能分支
3. 提交更改
4. 发起 Pull Request

## 许可证

本项目采用 [MIT License](LICENSE.md) 许可证。
