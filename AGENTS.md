# 智能体开发指南

## 🚀 技术栈

- **前端**: Vue 3 + TS + TailwindCSS + Pinia
- **后端**: Node.js + Express + PocketBase
- **部署**: Docker Compose

## ⚡ 核心命令

- **开发**: `pnpm run dev` (client:5175, server:4127)
- **构建**: `pnpm run build`
- **部署**: `docker-compose up -d`

## 🎯 关键架构

### 数据流

`Fetcher` → Express路由 → RequestHandler → DatabaseService

### 核心服务

- **认证**: ALTCHA验证码 + Bearer token
- **数据库**: PocketBase统一CRUD操作
- **时间管理**: 实时状态检查 + 倒计时
- **日志**: Winston彩色输出 + 文件轮转

### 主要数据表

- `users` - 用户信息
- `societies` - 社团信息
- `choosing_25B` - 选课记录
- `dates` - 时间配置
- `altcha_challenges` - 验证码

## 💡 开发原则

1. **TypeScript严格模式** - 避免 `any` 类型
2. **Vue Composition API** - `<script setup>`语法
3. **Pinia状态管理** - 统一错误处理
4. **向后兼容** - 不破坏现有功能
5. **安全第一** - 管理员权限验证 + 操作日志

## 🛠️ 扩展指南

### 添加功能

1. 前端组件 + Pinia store
2. 后端API路由 + 服务
3. 更新类型定义文件

### 修改功能

1. 理解现有数据流
2. 确保向后兼容
3. 更新文档注释
