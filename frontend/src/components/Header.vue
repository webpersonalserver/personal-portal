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

        <div class="header-user">
            <!-- 未登录 -->
            <a-avatar
                v-if="!userInfo"
                class="user-avatar"
                :size="32"
                @click="handleLogin"
            >
                <icon-user />
            </a-avatar>

            <!-- 已登录 -->
            <a-dropdown v-else trigger="click">
                <a-avatar class="user-avatar" :size="32">
                    <img v-if="userInfo.avatar" :src="userInfo.avatar" />
                    <span v-else>{{ userInfo.username?.charAt(0).toUpperCase() }}</span>
                </a-avatar>
                <template #content>
                    <a-doption disabled>
                        <icon-user /> {{ userInfo.username }}
                    </a-doption>
                    <a-doption @click="handleLogout">
                        <icon-export /> 退出登录
                    </a-doption>
                </template>
            </a-dropdown>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { login, logout, getUserProfile } from "@/api/user";

const route = useRoute();
const router = useRouter();

const userInfo = ref(null);

const menus = computed(() => [
    {
        key: "Home",
        label: "Home",
        path: "/"
    },
    // {
    //     key: "Heart",
    //     label: "Heart",
    //     path: "/heart"
    // },
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

// 登录
const handleLogin = async () => {
    try {
        // 这里先用模拟数据，后续可以改成弹窗输入
        const res = await login({ username: "admin", password: "123456" });
        localStorage.setItem("token", res.token);
        userInfo.value = res.user;
    } catch (error) {
        console.error("登录失败", error.message);
    }
};

// 退出登录
const handleLogout = async () => {
    try {
        await logout();
    } finally {
        localStorage.removeItem("token");
        userInfo.value = null;
    }
};

// 初始化：检查登录状态
const initUserInfo = async () => {
    const token = localStorage.getItem("token");
    if (token) {
        try {
            userInfo.value = await getUserProfile();
        } catch {
            localStorage.removeItem("token");
        }
    }
};

initUserInfo();
</script>

<style lang="less" scoped>
.personal-portal-header-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 60px;
    padding: 0 20px;
    overflow: hidden;
    box-sizing: border-box;
    background-color: #fff;
    border-bottom: 1px solid rgb(225, 226, 230);
    flex-shrink: 0;

    .header-user {
        .user-avatar {
            cursor: pointer;
        }
    }
}
</style>
