# Personal Portal Backend

基于 Node.js + Koa + MySQL 的个人网站后端项目。

## 技术栈

| 技术 | 说明 |
|------|------|
| Node.js | JavaScript 运行时 |
| Koa | 轻量级 Web 框架 |
| koa-router | 路由中间件 |
| koa-bodyparser | 请求体解析中间件 |
| @koa/cors | 跨域处理中间件 |
| mysql2 | MySQL 数据库驱动 |
| dotenv | 环境变量管理 |

## 目录结构

```
backend/
├── src/
│   └── app.js          # 应用入口文件
├── .env                # 环境变量（不提交到 git）
├── .env.example        # 环境变量示例
├── .gitignore          # git 忽略配置
├── package.json        # 项目依赖配置
└── README.md           # 项目文档
```

## 快速开始

### 1. 安装依赖

```bash
cd backend
npm install
```

### 2. 配置环境变量

复制 `.env.example` 为 `.env`，根据实际情况修改配置：

```bash
cp .env.example .env
```

### 3. 启动项目

```bash
# 开发模式（文件变动自动重启）
npm run dev

# 生产模式
npm start
```

### 4. 验证运行

访问 http://localhost:3000/api/health，看到以下响应说明启动成功：

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "status": "ok",
    "timestamp": "2024-01-26T02:51:00.000Z"
  }
}
```

---

## 代码解读

### app.js 核心代码说明

```js
const Koa = require('koa');                    // 引入 Koa 框架
const Router = require('koa-router');          // 引入路由
const bodyParser = require('koa-bodyparser');  // 解析请求体（POST 数据）
const cors = require('@koa/cors');             // 处理跨域请求
require('dotenv').config();                    // 加载 .env 环境变量

const app = new Koa();                         // 创建 Koa 实例
const router = new Router({ prefix: '/api' }); // 创建路由，统一 /api 前缀
```

#### Koa 中间件机制

Koa 使用"洋葱模型"处理请求，中间件按顺序执行：

```
请求 → cors → bodyParser → 路由处理 → 响应
```

```js
app.use(cors());        // 第 1 层：处理跨域
app.use(bodyParser());  // 第 2 层：解析请求体
app.use(router.routes()); // 第 3 层：路由匹配
```

#### 定义路由

```js
// GET 请求示例
router.get('/health', async (ctx) => {
  ctx.body = { ... };  // ctx.body 设置响应内容
});

// POST 请求示例（后续扩展）
router.post('/login', async (ctx) => {
  const { username, password } = ctx.request.body; // 获取请求体数据
  ctx.body = { ... };
});
```

#### ctx 对象常用属性

| 属性 | 说明 |
|------|------|
| `ctx.request.body` | POST 请求体数据 |
| `ctx.query` | URL 查询参数 `?name=xxx` |
| `ctx.params` | 路由参数 `/user/:id` |
| `ctx.body` | 设置响应内容 |
| `ctx.status` | 设置 HTTP 状态码 |

---

## 后续扩展建议

当项目功能增多时，建议按以下结构组织代码：

```
backend/
├── src/
│   ├── app.js              # 入口，组装中间件和路由
│   ├── config/             # 配置文件
│   │   └── index.js
│   ├── routes/             # 路由定义
│   │   ├── index.js        # 路由汇总
│   │   └── user.js         # 用户相关路由
│   ├── controllers/        # 控制器（处理请求逻辑）
│   │   └── userController.js
│   ├── services/           # 业务逻辑层
│   │   └── userService.js
│   ├── models/             # 数据模型
│   │   └── userModel.js
│   ├── middlewares/        # 自定义中间件
│   │   └── auth.js
│   └── utils/              # 工具函数
│       └── response.js
```

### 分层职责

| 层级 | 职责 | 示例 |
|------|------|------|
| **routes** | 定义 URL 与处理函数的映射 | `router.post('/login', controller.login)` |
| **controllers** | 接收请求、调用 service、返回响应 | 参数校验、调用 service、格式化响应 |
| **services** | 业务逻辑处理 | 密码加密、生成 token、调用数据库 |
| **models** | 数据库操作 | 增删改查 SQL |

---

## 常用命令

```bash
npm run dev     # 开发模式启动
npm start       # 生产模式启动
npm install xxx # 安装新依赖
```
