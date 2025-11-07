// src/router/index.ts
import { createRouter, createWebHashHistory } from "vue-router";
import config from "./config";
import { onBeforeEach, onAfterEach } from "./tools";

const router = createRouter({
    history: createWebHashHistory(), // Hash 模式
    routes: config
});

// 全局前置守卫 - 路由进入前
router.beforeEach((to, from, next) => {
    onBeforeEach({ to, from });

    next();
});

// 全局后置守卫 - 路由进入后
router.afterEach(() => {
    onAfterEach();
});

// 全局解析守卫 - 路由解析前（在 beforeEach 之后，组件解析之前）
router.beforeResolve((to, from, next) => {
    // 可以在这里进行数据预加载等
    next();
});

export default router;
