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

## 开发路线图

### 🚀 已完成功能

#### 核心系统架构
- ✅ **前后端分离架构**: Vue 3 + Express + PocketBase
- ✅ **TypeScript 全栈支持**: 完整的类型定义和类型安全
- ✅ **Docker 容器化**: 一键部署开发/生产环境
- ✅ **响应式设计**: 支持PC和移动端访问

#### 用户认证与权限
- ✅ **基于角色的访问控制**: 学生/教师权限分离
- ✅ **JWT 认证**: 安全的用户身份验证
- ✅ **会话管理**: 自动登录状态保持

#### 学生功能
- ✅ **社团浏览**: 查看所有社团详细信息
- ✅ **志愿选择**: 提交三个志愿选择，支持修改
- ✅ **问题回答**: 回答社团特定的筛选问题
- ✅ **状态查看**: 实时查看选课状态和结果
- ✅ **历史记录**: 查看个人选课历史

#### 教师功能
- ✅ **社团管理**: 创建、编辑、删除社团信息
- ✅ **志愿审核**: 审核学生提交的志愿选择
- ✅ **数据导出**: 导出选课数据为Excel格式
- ✅ **时间管理**: 设置选课时间窗口
- ✅ **用户管理**: 管理学生和教师账户

#### 系统管理
- ✅ **数据库迁移**: 自动化数据库结构更新
- ✅ **日志记录**: 完整的操作日志和错误追踪
- ✅ **实时更新**: 无需刷新的状态同步

### 🔄 当前开发中

#### 性能优化
- 🔄 **前端性能**: 代码分割和懒加载优化
- 🔄 **API 性能**: 缓存策略和查询优化
- 🔄 **数据库性能**: 索引优化和查询调优

#### 用户体验改进
- 🔄 **界面优化**: 更好的视觉设计和交互体验
- 🔄 **错误处理**: 更友好的错误提示和恢复机制
- 🔄 **加载状态**: 优化加载动画和进度指示

### 📋 计划功能

#### 短期目标 (1-2个月)
- 📋 **批量操作**: 支持批量审核和批量导出
- 📋 **数据统计**: 选课数据可视化图表
- 📋 **通知系统**: 邮件/站内消息通知
- 📋 **移动端优化**: 专门的移动端界面适配

#### 中期目标 (3-6个月)
- 📋 **智能分配**: 基于规则的自动分配算法
- 📋 **多语言支持**: 中英文界面切换
- 📋 **API 文档**: 完整的API文档和测试工具
- 📋 **监控告警**: 系统性能监控和异常告警

#### 长期目标 (6个月以上)
- 📋 **微服务架构**: 服务拆分和独立部署
- 📋 **高可用部署**: 负载均衡和故障转移
- 📋 **数据分析**: 深度数据分析和报表功能
- 📋 **第三方集成**: 与学校其他系统集成

### 🛠️ 技术债务

#### 代码质量
- 🛠️ **单元测试**: 提高测试覆盖率
- 🛠️ **代码规范**: 统一代码风格和最佳实践
- 🛠️ **文档完善**: 补充技术文档和注释

#### 架构优化
- 🛠️ **状态管理**: 优化Pinia状态管理策略
- 🛠️ **API 设计**: RESTful API设计优化
- 🛠️ **安全性**: 安全审计和漏洞修复

### 📊 版本规划

#### v1.1.0 (下一版本)
- 批量操作功能
- 数据统计图表
- 通知系统基础功能
- 移动端界面优化

#### v1.2.0
- 智能分配算法
- 多语言支持
- API文档系统
- 性能监控

#### v2.0.0
- 微服务架构重构
- 高可用部署方案
- 深度数据分析功能
- 第三方系统集成

### 🤝 贡献指南

我们欢迎社区贡献！如果您想参与项目开发，请：

1. 查看 [Issues](https://github.com/your-repo/issues) 了解待解决问题
2. Fork 项目并创建功能分支
3. 提交 Pull Request 并详细说明变更内容
4. 确保代码通过所有测试和代码检查

### 📞 联系方式

如有问题或建议，请通过以下方式联系：
- 提交 GitHub Issue
- 发送邮件至项目维护者
- 加入项目讨论群组

## 核心概念

### 用户角色

- **学生**: 可以浏览社团、提交志愿选择
- **教师**: 可以管理社团、导出数据、审核志愿

### 社团数据结构

- 名称、限额
- 核心成员、指导教师
- 选课限制条件
- 特定问题（可选）

### 选课流程

1. 系统开放选课时间窗口
2. 学生登录并提交三个志愿
3. 系统根据规则分配社团
4. 教师审核并导出结果

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
