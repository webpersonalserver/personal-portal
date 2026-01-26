import js from "@eslint/js";
import vue from "eslint-plugin-vue";

export default [
    // 基础 JavaScript 推荐规则
    js.configs.recommended,
    // Vue 插件配置
    ...vue.configs["flat/essential"],
    // Vue 推荐规则（更严格）
    ...vue.configs["flat/recommended"],
    {
        files: ["**/*.{js,mjs,cjs,ts,vue}"],
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: "module",
            globals: {
                console: "readonly",
                process: "readonly",
                Buffer: "readonly",
                __dirname: "readonly",
                __filename: "readonly",
                module: "readonly",
                require: "readonly",
                exports: "readonly",
                window: "readonly",
                document: "readonly",
                setInterval: "readonly",
                clearInterval: "readonly",
                requestAnimationFrame: "readonly",
                cancelAnimationFrame: "readonly",
            },
        },
        rules: {
            // 缩进：4个空格
            indent: ["error", 4, { SwitchCase: 1 }],
            // 引号：双引号
            quotes: ["error", "double", { avoidEscape: true }],
            // 分号：使用分号
            semi: ["error", "always"],
            // 尾随逗号：不允许尾随逗号
            "comma-dangle": ["error", "never"],
            // 对象大括号内空格
            "object-curly-spacing": ["error", "always"],
            // 数组方括号内空格
            "array-bracket-spacing": ["error", "never"],
            // 行尾空格
            "no-trailing-spaces": "error",
            // 文件末尾空行
            "eol-last": ["error", "always"],
            // 最大行长度
            "max-len": ["warn", { code: 120, ignoreUrls: true, ignoreStrings: true }],
            // 禁止未使用的变量
            "no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
            // 禁止 console（警告级别）
            "no-console": "warn",
            // 禁止 debugger
            "no-debugger": "error",
            // 箭头函数参数括号
            "arrow-parens": ["error", "as-needed"],
            // 箭头函数空格
            "arrow-spacing": "error",
            // 函数名和括号之间的空格
            "space-before-function-paren": [
                "error",
                {
                    anonymous: "always",
                    named: "never",
                    asyncArrow: "always",
                },
            ],
            // 关键字前后空格
            "keyword-spacing": "error",
            // 操作符周围空格
            "space-infix-ops": "error",
            // 块内填充
            "padded-blocks": ["error", "never"],
            // 多行语句
            "brace-style": ["error", "1tbs", { allowSingleLine: true }],
        },
    },
    // Vue 特定规则
    {
        files: ["**/*.vue"],
        rules: {
            // 在 Vue 文件中禁用基础 indent 规则，使用 vue/script-indent
            indent: "off",
            // Vue 文件缩进
            "vue/html-indent": ["error", 4],
            // Vue script 缩进
            "vue/script-indent": ["error", 4, { baseIndent: 0 }],
            // Vue 属性顺序
            "vue/attributes-order": "error",
            // Vue 组件名称（允许单字组件名）
            "vue/multi-word-component-names": "off",
            // Vue 属性换行
            "vue/max-attributes-per-line": [
                "warn",
                {
                    singleline: 3,
                    multiline: 1,
                },
            ],
            // Vue 单行元素内容换行
            "vue/singleline-html-element-content-newline": "off",
            // Vue 多行元素内容换行
            "vue/multiline-html-element-content-newline": "off",
            // Vue 自闭合标签
            "vue/html-self-closing": [
                "error",
                {
                    html: {
                        void: "always",
                        normal: "never",
                        component: "always",
                    },
                    svg: "always",
                    math: "always",
                },
            ],
            // Vue 属性引号
            "vue/html-quotes": ["error", "double"],
            // Vue 指令顺序
            "vue/order-in-components": "error",
            // Vue 禁止 v-html
            "vue/no-v-html": "warn",
            // Vue props 默认值（警告级别，不强制）
            "vue/require-default-prop": "warn",
        },
    },
    // 忽略文件（放在最后，确保优先级）
    {
        ignores: [
            "node_modules/**",
            "dist/**",
            "build/**",
            "*.min.js",
            "coverage/**",
            ".vitepress/dist/**",
            ".vitepress/cache/**",
            "docs/.vitepress/dist/**",
            "docs/.vitepress/cache/**",
        ],
    },
];
