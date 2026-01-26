<template>
    <div class="personal-portal-website-container">
        <Header v-show="showHeader" />

        <div class="personal-portal-body-container">
            <router-view v-slot="{ Component, route: routeSlot }">
                <transition
                    :name="getTransitionName(routeSlot)"
                    mode="out-in"
                >
                    <component :is="Component" :key="routeSlot.path" />
                </transition>
            </router-view>
        </div>

        <Footer v-if="showFooter" />
    </div>
</template>

<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import Header from "./components/Header.vue";
import Footer from "./components/Footer.vue";

// 获取当前路由信息（route 对象本身是响应式的）
// 可以直接在模板中使用 route.path、route.name 等，会自动更新
const route = useRoute();

const showHeader = computed(() => {
    return !route.meta.hideHeader;
});

const showFooter = computed(() => {
    return !!route.meta.displayFooter;
});

function getTransitionName(route) {
    const { transition = "slide-fade" } = route.meta;

    return transition;
}

</script>

<style lang="less" scoped>
.personal-portal-website-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
  box-sizing: border-box;
  background-color: #f0f0f0;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;

  .personal-portal-body-container {
    flex: 1;
    overflow: hidden;
    box-sizing: border-box;
    background-color: #fff;
    position: relative;
  }
}
</style>
