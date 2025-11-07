# Personal Portal

一个基于 Vue 3 + Vite 构建的个人门户项目，集成了 VitePress 文档系统。

🌐 **在线访问**: [https://webpersonalserver.github.io/personal-portal/](https://webpersonalserver.github.io/personal-portal/)

## ✨ 特性

- 🚀 **Vue 3** - 使用最新的 Vue 3 Composition API 和 `<script setup>` 语法
- ⚡️ **Vite** - 极速的开发构建工具，支持 HMR
- 🧭 **Vue Router** - 单页面应用路由管理
- 📚 **VitePress** - 现代化的文档生成工具
- 🎨 **Less** - CSS 预处理器，支持嵌套和变量
- 🔍 **ESLint** - 代码质量检查和规范
- 🔥 **热模块替换 (HMR)** - 快速开发反馈
- 📦 **GitHub Pages** - 支持一键部署

## 📦 技术栈

- **前端框架**: Vue 3.5.23
- **路由管理**: Vue Router 4.6.3
- **构建工具**: Vite 7.1.7
- **文档工具**: VitePress 1.6.4
- **CSS 预处理器**: Less 4.4.2
- **代码规范**: ESLint 9.39.1
- **开发语言**: JavaScript (ES Modules)

## 🚀 快速开始

### 环境要求

- Node.js (推荐使用 LTS 版本，>= 20.19.0)
- npm 或 yarn

### 安装依赖

```bash
npm install
```

### 开发

启动 Vue 应用开发服务器：

```bash
npm run dev
```

启动文档开发服务器：

```bash
npm run docs:dev
```

### 构建

构建生产版本：

```bash
npm run build
```

构建文档：

```bash
npm run docs:build
```

### 预览

预览构建后的应用：

```bash
npm run preview
```

预览构建后的文档：

```bash
npm run docs:preview
```

### 代码检查

检查代码规范：

```bash
npm run lint
```

自动修复代码问题：

```bash
npm run lint:fix
```

### 部署

部署应用到 GitHub Pages：

```bash
npm run deploy
```

部署文档到 GitHub Pages：

```bash
npm run docs:deploy
```

## 📁 项目结构

```
personal-portal/
├── docs/                          # VitePress 文档目录
│   ├── .vitepress/               # VitePress 配置文件
│   │   └── config.ts            # 文档配置
│   └── src/
│       └── Markdown/             # Markdown 文档源文件
│           ├── index.md         # 文档首页
│           └── AI.md            # AI 相关文档
├── src/                          # Vue 应用源代码
│   ├── assets/                  # 静态资源（图片、字体等）
│   │   └── vue.svg
│   ├── components/              # 公共组件
│   │   ├── Header.vue          # 头部组件
│   │   └── Footer.vue          # 底部组件
│   ├── pages/                   # 页面组件
│   │   └── Home.vue            # 首页
│   ├── router/                  # 路由配置
│   │   └── index.js            # 路由定义
│   ├── App.vue                  # 根组件
│   ├── main.js                  # 应用入口
│   └── style.css                # 全局样式
├── public/                      # 公共静态资源
│   └── vite.svg
├── index.html                   # HTML 模板
├── vite.config.js              # Vite 配置文件
├── eslint.config.js            # ESLint 配置文件
└── package.json                # 项目配置和依赖
```

## 📝 代码规范

项目使用 ESLint 进行代码质量检查，主要规范包括：

### 缩进和格式

- **缩进**: 4 个空格
- **引号**: 单引号
- **分号**: 不使用分号
- **尾随逗号**: 多行时使用尾随逗号
- **行长度**: 最大 120 字符

### Vue 组件规范

- 组件名可以使用单字（如 `Header`、`Footer`）
- HTML 标签不自闭合，Vue 组件标签自闭合
- 属性顺序遵循 Vue 官方推荐顺序
- 使用 `<script setup>` 语法

### 示例

```vue
<template>
  <div class="example-container">
    <Header />
    <router-view />
  </div>
</template>

<script setup>
import Header from "./components/Header.vue";
</script>

<style lang="less" scoped>
.example-container {
  width: 100%;
  height: 100%;
}
</style>
```

## 🛠️ 开发指南

### 添加新组件

在 `src/components/` 目录下创建新的 Vue 组件：

```vue
<template>
  <div class="my-component">组件内容</div>
</template>

<script setup>
// 组件逻辑
</script>

<style lang="less" scoped>
.my-component {
  // 样式
}
</style>
```

### 添加新页面

1. 在 `src/pages/` 目录下创建页面组件
2. 在 `src/router/index.js` 中添加路由配置：

```javascript
import NewPage from "../pages/NewPage.vue";

const routes = [
  { path: "/", name: "Home", component: Home },
  { path: "/new", name: "NewPage", component: NewPage },
];
```

### 使用 Less

项目已配置 Less 预处理器，可以直接在 Vue 组件中使用：

```vue
<style lang="less" scoped>
.container {
  width: 100%;

  .header {
    height: 60px;
    background-color: #fff;

    &:hover {
      background-color: #f0f0f0;
    }
  }
}
</style>
```

### 添加新文档

在 `docs/src/Markdown/` 目录下创建新的 Markdown 文件，并在 `docs/.vitepress/config.ts` 中配置导航和侧边栏：

```typescript
sidebar: [
  {
    text: "AI",
    link: "/AI",
  },
  {
    text: "新文档",
    link: "/新文档",
  },
];
```

## 🎨 样式规范

### 布局结构

项目采用 Flexbox 布局：

- **容器**: 使用 `flex` 布局，垂直方向排列
- **Header**: 固定高度 60px，不收缩
- **Body**: 自适应高度，可滚动
- **Footer**: 固定高度 100px，不收缩

### 命名规范

使用 BEM 风格的命名约定：

- 组件容器: `组件名-container` (如 `personal-portal-header-container`)
- 页面容器: `portal-pages-页面名-container` (如 `portal-pages-home-container`)

## 📚 文档

项目文档使用 VitePress 构建，文档源文件位于 `docs/src/Markdown/` 目录。

- ✅ 支持 Vue 组件语法
- ✅ 支持 Markdown 扩展语法
- ✅ 支持代码高亮
- ✅ 支持热更新

## 🚢 部署

项目配置了 GitHub Pages 部署脚本，支持部署应用和文档：

### 部署应用

```bash
npm run deploy
```

这会将构建后的应用部署到 `gh-pages` 分支的根目录。

**访问地址**: [https://webpersonalserver.github.io/personal-portal/](https://webpersonalserver.github.io/personal-portal/)

### 部署文档

```bash
npm run docs:deploy
```

这会将构建后的文档部署到 `gh-pages` 分支。

**注意**: 确保在 `vite.config.js` 中正确配置了 `base` 路径（如 `/personal-portal/`），以匹配 GitHub Pages 的仓库路径。

## 📄 许可证

本项目为私有项目。

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

**提示**: 在提交代码前，建议运行 `npm run lint:fix` 自动修复代码格式问题。
