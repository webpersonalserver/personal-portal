<template>
    <div class="personal-portal-header-container">
        <a-menu
            mode="horizontal"
            :default-selected-keys="[selectedKey]"
            :selected-keys="[selectedKey]"
            @menu-item-click="handleMenuClick"
        >
            <a-menu-item v-for="item in menus" :key="item.key">
                {{ item.label }}
            </a-menu-item>
        </a-menu>
    </div>
</template>

<script setup>
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const menus = computed(() => [
    {
        key: "Home",
        label: "Home",
        path: "/"
    },
    {
        key: "Heart",
        label: "Heart",
        path: "/heart"
    },
    {
        key: "MCP",
        label: "MCP",
        path: "/mcp"
    }
]);

// 根据当前路由设置选中的菜单项
const selectedKey = computed(() => {
    const currentPath = route.path;
    const menu = menus.value.find(item => item.path === currentPath);

    return menu ? menu.key : menus.value[0].key;
});

// 处理菜单点击事件，实现路由跳转
const handleMenuClick = key => {
    const menu = menus.value.find(item => item.key === key);

    if (menu && menu.path) {
        router.replace(menu.path);
    }
};
</script>

<style lang="less" scoped>
.personal-portal-header-container {
  width: 100%;
  height: 60px;
  overflow: hidden;
  box-sizing: border-box;
  background-color: #fff;
  border-bottom: 1px solid rgb(225, 226, 230);
  flex-shrink: 0;
}
</style>
