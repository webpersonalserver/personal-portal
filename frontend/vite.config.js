import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ArcoResolver } from "unplugin-vue-components/resolvers";

// https://vite.dev/config/
export default defineConfig({
    base: "/personal-portal/",
    plugins: [
        vue(),
        // 自动导入 Arco Design 的 composables 和工具函数
        AutoImport({
            resolvers: [ArcoResolver()]
        }),
        // 自动导入 Arco Design 组件（按需引入）
        Components({
            resolvers: [
                ArcoResolver({
                    sideEffect: true // 自动导入组件样式
                })
            ]
        })
    ],
    css: {
        preprocessorOptions: {
            less: {
                javascriptEnabled: true // 如果需要在 less 中使用 JS 表达式
            }
        }
    },
    server: {
        proxy: {
            '/api': {
                target: 'http://localhost:3000',
                changeOrigin: true,
            }
        }
    }
});
