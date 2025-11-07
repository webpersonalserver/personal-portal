<template>
    <div class="portal-pages-experiment-container">
        <div class="floating-hearts">
            <span
                v-for="i in 20"
                :key="i"
                class="floating-heart"
                :style="{
                    left: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 5}s`,
                    fontSize: `${15 + Math.random() * 10}px`
                }"
            >
                ❤️
            </span>
        </div>

        <div ref="containerRef" class="heart-container"></div>

        <div class="romantic-text">Love You Forever 💕</div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from "vue";
import * as THREE from "three";

const containerRef = ref(null);
let scene = null;
let camera = null;
let renderer = null;
let particles = null;
let animationId = null;

// 红色和粉色颜色数组
const colors = [
    0xff1744, // 红色
    0xff6b9d, // 粉色
    0xff4081, // 粉红色
    0xe91e63, // 粉红色
    0xc2185b, // 深粉色
    0xff1493, // 深粉色
    0xff69b4, // 热粉色
    0xffc0cb // 浅粉色
];

// 绘制爱心形状（使用贝塞尔曲线，与之前 Canvas 2D 版本一致）
const drawHeart = (ctx, x, y, size) => {
    ctx.beginPath();
    const topCurveHeight = size * 0.3;
    ctx.moveTo(x, y + topCurveHeight);
    // 左曲线
    ctx.bezierCurveTo(x, y, x - size / 2, y, x - size / 2, y + topCurveHeight);
    // 左底部
    ctx.bezierCurveTo(x - size / 2, y + size * 0.7, x, y + size * 0.9, x, y + size);
    // 右底部
    ctx.bezierCurveTo(x, y + size * 0.9, x + size / 2, y + size * 0.7, x + size / 2, y + topCurveHeight);
    // 右曲线
    ctx.bezierCurveTo(x + size / 2, y, x, y, x, y + topCurveHeight);
    ctx.closePath();
};

// 检查点是否在爱心内部（使用 Canvas 2D 路径检测，与之前版本一致）
const isPointInHeart = (x, y, centerX = 0, centerY = 0, size = 350) => {
    // 创建临时 canvas 来检测点
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = size * 2;
    canvas.height = size * 2;

    // 在 canvas 中心绘制爱心
    drawHeart(ctx, size, size, size);

    // 将点坐标转换到 canvas 坐标系
    const canvasX = size + (x - centerX);
    const canvasY = size + (y - centerY);

    return ctx.isPointInPath(canvasX, canvasY);
};

// 生成爱心形状的点（填充整个爱心内部，使用与之前 Canvas 2D 一致的形状）
const generateHeartPoints = (count = 15000) => {
    const positions = new Float32Array(count * 3);
    const colorsArray = new Float32Array(count * 3);

    // 爱心尺寸（与之前 Canvas 版本一致）
    const heartSize = 350;
    const centerX = 0;
    const centerY = 0;

    // 爱心的边界范围（基于贝塞尔曲线爱心）
    const maxX = heartSize / 2;
    const maxY = heartSize;

    let generated = 0;
    let attempts = 0;
    const maxAttempts = count * 15; // 增加尝试次数

    // 使用网格化 + 随机填充的方式（减小网格，增加密度）
    const gridSize = 5; // 减小网格大小，增加粒子密度
    const gridPoints = [];

    // 先创建网格点
    const startX = centerX - maxX;
    const startY = centerY - maxY / 2;
    for (let y = startY; y < startY + heartSize; y += gridSize) {
        for (let x = startX; x < startX + heartSize; x += gridSize) {
            if (isPointInHeart(x, y, centerX, centerY, heartSize)) {
                gridPoints.push({ x, y });
            }
        }
    }

    // 填充网格点（增加网格点使用比例）
    for (let i = 0; i < Math.min(gridPoints.length, count * 0.8); i++) {
        const point = gridPoints[i];
        const offsetX = (Math.random() - 0.5) * gridSize * 0.6;
        const offsetY = (Math.random() - 0.5) * gridSize * 0.6;
        const offsetZ = (Math.random() - 0.5) * 2;

        // 翻转 Y 坐标（Three.js Y 轴向上，Canvas Y 轴向下）
        positions[generated * 3] = point.x + offsetX;
        positions[generated * 3 + 1] = -(point.y + offsetY); // 翻转 Y 轴
        positions[generated * 3 + 2] = offsetZ;

        // 随机红色或粉色
        const color = new THREE.Color(colors[Math.floor(Math.random() * colors.length)]);
        colorsArray[generated * 3] = color.r;
        colorsArray[generated * 3 + 1] = color.g;
        colorsArray[generated * 3 + 2] = color.b;

        generated++;
    }

    // 随机填充剩余的点（增加密度）
    while (generated < count && attempts < maxAttempts) {
        attempts++;
        const x = startX + Math.random() * heartSize;
        const y = startY + Math.random() * heartSize;

        if (isPointInHeart(x, y, centerX, centerY, heartSize)) {
            const offsetZ = (Math.random() - 0.5) * 2;

            // 翻转 Y 坐标
            positions[generated * 3] = x;
            positions[generated * 3 + 1] = -y; // 翻转 Y 轴
            positions[generated * 3 + 2] = offsetZ;

            // 随机红色或粉色
            const color = new THREE.Color(colors[Math.floor(Math.random() * colors.length)]);
            colorsArray[generated * 3] = color.r;
            colorsArray[generated * 3 + 1] = color.g;
            colorsArray[generated * 3 + 2] = color.b;

            generated++;
        }
    }

    // 如果还没填满，继续随机填充
    while (generated < count && attempts < maxAttempts * 2) {
        attempts++;
        const x = startX + Math.random() * heartSize;
        const y = startY + Math.random() * heartSize;

        if (isPointInHeart(x, y, centerX, centerY, heartSize)) {
            const offsetZ = (Math.random() - 0.5) * 2;

            // 翻转 Y 坐标
            positions[generated * 3] = x;
            positions[generated * 3 + 1] = -y; // 翻转 Y 轴
            positions[generated * 3 + 2] = offsetZ;

            const color = new THREE.Color(colors[Math.floor(Math.random() * colors.length)]);
            colorsArray[generated * 3] = color.r;
            colorsArray[generated * 3 + 1] = color.g;
            colorsArray[generated * 3 + 2] = color.b;

            generated++;
        }
    }

    return { positions, colors: colorsArray };
};

// 初始化 Three.js 场景
const initThree = () => {
    if (!containerRef.value) {
        console.error("Container ref is null");
        return;
    }

    // 创建场景
    scene = new THREE.Scene();
    scene.background = null; // 透明背景

    // 获取容器尺寸
    const rect = containerRef.value.getBoundingClientRect();
    const width = rect.width || 800;
    const height = rect.height || 800;

    console.log("Container size:", width, height);

    // 创建相机（调整位置以适应 350 尺寸的爱心）
    camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(0, 0, 400); // 调整相机距离以适应爱心尺寸

    // 创建渲染器
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0); // 透明背景
    renderer.domElement.style.display = "block";
    containerRef.value.appendChild(renderer.domElement);

    // 生成粒子数据（增加数量以填充爱心）
    const { positions, colors: colorsArray } = generateHeartPoints(15000);
    console.log("Generated particles:", positions.length / 3);

    // 创建粒子几何体
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colorsArray, 3));

    // 创建粒子材质（使用 PointsMaterial 确保可见）
    const material = new THREE.PointsMaterial({
        size: 2.0, // 增大粒子尺寸
        vertexColors: true,
        transparent: true,
        opacity: 1.0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        sizeAttenuation: true
    });

    // 创建粒子系统
    particles = new THREE.Points(geometry, material);
    scene.add(particles);

    console.log("Particles added to scene");

    // 动画循环
    const animate = () => {
        animationId = requestAnimationFrame(animate);

        // 更新时间
        const time = Date.now() * 0.001;

        // 轻微跳动效果（缩放）
        const scale = 1 + Math.sin(time * 2) * 0.05; // 轻微跳动，幅度5%
        particles.scale.set(scale, scale, scale);

        // 相机保持静止，只看向中心
        camera.lookAt(0, 0, 0);

        renderer.render(scene, camera);
    };

    animate();

    // 处理窗口大小变化
    const handleResize = () => {
        if (!containerRef.value) return;
        const rect = containerRef.value.getBoundingClientRect();
        const width = rect.width || 800;
        const height = rect.height || 800;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
    };

    window.addEventListener("resize", handleResize);

    // 清理函数
    return () => {
        window.removeEventListener("resize", handleResize);
    };
};

onMounted(() => {
    // 等待 DOM 完全渲染后再初始化
    nextTick(() => {
        window.setTimeout(() => {
            const cleanup = initThree();

            // 保存清理函数
            if (cleanup) {
                onUnmounted(() => {
                    cleanup();
                });
            }
        }, 100); // 额外延迟确保容器已渲染
    });
});

onUnmounted(() => {
    if (animationId) {
        cancelAnimationFrame(animationId);
    }

    if (renderer) {
        renderer.dispose();
    }

    if (particles) {
        particles.geometry.dispose();
        particles.material.dispose();
    }

    if (containerRef.value && renderer && renderer.domElement) {
        try {
            containerRef.value.removeChild(renderer.domElement);
        } catch (e) {
            console.warn("Error removing renderer:", e);
        }
    }
});
</script>

<style lang="less" scoped>
.portal-pages-experiment-container {
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

.floating-hearts {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    pointer-events: none;
    overflow: hidden;
    z-index: 1;
}

.floating-heart {
    position: absolute;
    font-size: 20px;
    animation: float 15s infinite linear;
    opacity: 0.4;
}

.floating-heart:nth-child(odd) {
    animation-duration: 20s;
    animation-delay: -5s;
}

.floating-heart:nth-child(even) {
    animation-duration: 25s;
    animation-delay: -10s;
}

@keyframes float {
    0% {
        transform: translateY(100vh) rotate(0deg);
        opacity: 0;
    }
    10% {
        opacity: 0.4;
    }
    90% {
        opacity: 0.4;
    }
    100% {
        transform: translateY(-100px) rotate(360deg);
        opacity: 0;
    }
}

.heart-container {
    position: relative;
    z-index: 2;
    width: 800px;
    height: 800px;
    animation: heartBeat 2.5s ease-in-out infinite;
}

@keyframes heartBeat {
    0%, 100% {
        transform: scale(1);
    }
    10% {
        transform: scale(1.02);
    }
    20% {
        transform: scale(1);
    }
    30% {
        transform: scale(1.02);
    }
    40% {
        transform: scale(1);
    }
}

.romantic-text {
    margin-top: 30px;
    font-size: 32px;
    font-weight: bold;
    color: #fff;
    text-shadow: 2px 2px 10px rgba(255, 20, 147, 0.8), 0 0 20px rgba(255, 105, 180, 0.6);
    animation: textGlow 2s ease-in-out infinite alternate, textBounce 2s ease-in-out infinite;
    z-index: 3;
    position: relative;
}

@keyframes textGlow {
    0% {
        text-shadow: 2px 2px 10px rgba(255, 20, 147, 0.8), 0 0 20px rgba(255, 105, 180, 0.6);
    }
    100% {
        text-shadow: 2px 2px 20px rgba(255, 20, 147, 1), 0 0 30px rgba(255, 105, 180, 0.8);
    }
}

@keyframes textBounce {
    0%, 100% {
        transform: translateY(0);
    }
    50% {
        transform: translateY(-3px);
    }
}
</style>
