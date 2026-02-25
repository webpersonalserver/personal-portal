# Personal Portal

个人门户项目，采用前后端分离架构：
- 前端：`Vue 3 + Vite + Arco Design + Vue Router + Axios + Three.js`
- 后端：`Node.js + Koa + koa-router`

## 项目结构

```text
personal-portal/
├─ frontend/   # 前端应用（Vite）
└─ backend/    # 后端服务（Koa）
```

## 功能概览

- 基础页面路由：`/`、`/mcp`、`/heart`
- 顶部菜单与页面切换动效
- MCP 页面表格/筛选（当前为前端模拟数据）
- Heart 页面 Three.js 粒子爱心动画
- 登录态流程（本地 token + 后端 mock 用户接口）

## 环境要求

- Node.js 18+（建议使用 LTS）
- npm 9+

## 快速开始

### 1. 启动后端

```bash
cd backend
npm install
npm run dev
```

默认监听：`http://localhost:3000`

健康检查：

```bash
GET http://localhost:3000/api/health
```

### 2. 启动前端

新开一个终端：

```bash
cd frontend
npm install
npm run dev
```

默认访问：`http://localhost:5173`

前端已配置 Vite 代理：
- `/api` -> `http://localhost:3000`

## 默认登录账号（Mock）

来自后端 `backend/src/routes/user.js`：

- `username`: `admin`
- `password`: `123456`

## 后端接口

基础前缀：`/api`

- `GET /health`：健康检查
- `POST /user/login`：登录
- `POST /user/logout`：登出（需 `Authorization: Bearer <token>`）
- `GET /user/profile`：获取用户信息（需 `Authorization: Bearer <token>`）

## 常用命令

### frontend

```bash
npm run dev
npm run build
npm run preview
npm run lint
npm run lint:fix
npm run docs:dev
npm run docs:build
```

### backend

```bash
npm run dev
npm start
```

## 部署说明（前端）

`frontend/vite.config.js` 中已设置：

- `base: "/personal-portal/"`

适用于 GitHub Pages 子路径部署（仓库名为 `personal-portal` 时）。
