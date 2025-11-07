# Personal Portal

一个基于 Vue 3 + Vite 构建的个人门户项目，集成了 VitePress 文档系统。

## ✨ 特性

- 🚀 **Vue 3** - 使用最新的 Vue 3 Composition API
- ⚡️ **Vite** - 极速的开发构建工具
- 📚 **VitePress** - 现代化的文档生成工具
- 🎨 **TypeScript 支持** - 类型安全的开发体验
- 🔥 **热模块替换 (HMR)** - 快速开发反馈

## 📦 技术栈

- **前端框架**: Vue 3.5.23
- **构建工具**: Vite 7.1.7
- **文档工具**: VitePress 1.6.4
- **开发语言**: JavaScript (ES Modules)

## 🚀 快速开始

### 环境要求

- Node.js (推荐使用 LTS 版本)
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

## 📁 项目结构

```
personal-portal/
├── docs/                    # VitePress 文档目录
│   ├── .vitepress/         # VitePress 配置文件
│   │   └── config.ts       # 文档配置
│   └── src/
│       └── Markdown/       # Markdown 文档源文件
│           ├── index.md    # 文档首页
│           └── AI.md       # AI 相关文档
├── src/                    # Vue 应用源代码
│   ├── assets/            # 静态资源
│   ├── components/        # Vue 组件
│   ├── App.vue            # 根组件
│   ├── main.js            # 应用入口
│   └── style.css          # 全局样式
├── public/                # 公共静态资源
├── index.html             # HTML 模板
├── vite.config.js         # Vite 配置文件
└── package.json           # 项目配置和依赖
```

## 📝 文档

项目文档使用 VitePress 构建，文档源文件位于 `docs/src/Markdown/` 目录。

- 支持 Vue 组件语法
- 支持 Markdown 扩展语法
- 支持代码高亮
- 支持热更新

## 🛠️ 开发

### 添加新组件

在 `src/components/` 目录下创建新的 Vue 组件。

### 添加新文档

在 `docs/src/Markdown/` 目录下创建新的 Markdown 文件，并在 `docs/.vitepress/config.ts` 中配置导航和侧边栏。

## 📄 许可证

本项目为私有项目。

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！
