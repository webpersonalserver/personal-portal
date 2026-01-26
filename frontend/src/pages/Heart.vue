<template>
    <div class="portal-pages-heart-container">
        <HeartParticles />
    </div>
</template>

<script setup>
import HeartParticles from "../components/HeartParticles.vue";
</script>

<style lang="less" scoped>
.portal-pages-heart-container {
    width: 100%;
    height: 100%;
    overflow: hidden;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
    position: relative;
}
</style>
