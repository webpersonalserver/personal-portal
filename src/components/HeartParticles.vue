<template>
    <div ref="container" class="heart-container">
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


        <canvas ref="rainCanvas" class="rain-canvas"></canvas>

        <div class="romantic-text">Love You Forever 💕</div>
    </div>
</template>

  <script setup>
import { onMounted, onBeforeUnmount, ref, nextTick } from "vue";
import * as THREE from "three";

const container = ref();
const rainCanvas = ref();
let scene, camera, renderer, points, animationId, clock, material, geometry, baseColors, sparkleValues;
let baseScale = 1; // 基础缩放比例
let fireworks = []; // 烟花数组
let rainCtx = null; // Canvas上下文
let rainAnimationId = null; // 烟花动画ID
let lastFireworkTime = 0; // 上次发射烟花的时间

onMounted(() => {
    nextTick(() => {
        init();
        animate();
    });
});

onBeforeUnmount(() => {
    cancelAnimationFrame(animationId);
    if (rainAnimationId) {
        cancelAnimationFrame(rainAnimationId);
    }
    geometry?.dispose();
    material?.dispose();
    renderer?.dispose();
    window.removeEventListener("resize", onWindowResize);
});

// 计算基于屏幕宽度的缩放比例
function calculateScale() {
    // 心形的实际宽度大约是32（x范围从-16到16）
    const heartWidth = 32;
    // 使用屏幕宽度的99%来显示爱心（非常接近容器宽度，但留一点边距确保不超出）
    const targetRatio = 0.99;
    // 计算在camera距离4.5，FOV 75的情况下，可见的3D空间宽度
    const fov = 75;
    const distance = 4.5; // 与camera.position.z保持一致
    const visibleWidth = 2 * Math.tan((fov * Math.PI) / 360) * distance;
    // 计算缩放比例：使爱心刚好占满屏幕宽度的99%，不超过容器宽度
    baseScale = (visibleWidth * targetRatio) / heartWidth;
    // 增加额外的缩放倍数，让爱心更大
    baseScale = baseScale * 1.3;
    return baseScale;
}

function init() {
    if (!container.value) {
        console.error("Container not ready");
        return;
    }

    // 场景
    scene = new THREE.Scene();

    // 摄像机
    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    // 减小相机距离，让爱心看起来更大
    camera.position.z = 4.5;

    // 计算自适应缩放比例（已在函数内部应用1.2倍缩放）
    calculateScale();
    console.log("Base scale:", baseScale);

    // 渲染器
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.domElement.style.position = "absolute";
    renderer.domElement.style.top = "0";
    renderer.domElement.style.left = "0";
    renderer.domElement.style.zIndex = "10";
    renderer.domElement.style.pointerEvents = "none";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    container.value.appendChild(renderer.domElement);

    // 粒子几何
    geometry = new THREE.BufferGeometry();
    const vertices = [];
    const colors = [];
    sparkleValues = []; // 每个粒子的闪烁频率值
    baseColors = []; // 保存基础颜色
    const count = 7000; // 增加粒子数量以填充更大的爱心

    // 丰富的色彩 palette（包含多种色系）
    const valentineColors = [
        // 粉红系
        new THREE.Color(0xff3366), // 粉红色
        new THREE.Color(0xff1744), // 深粉红
        new THREE.Color(0xff6b9d), // 浅粉红
        new THREE.Color(0xff4081), // 玫瑰粉
        new THREE.Color(0xe91e63), // 粉紫色
        new THREE.Color(0xf50057), // 亮粉红
        new THREE.Color(0xffb3d9), // 极淡粉
        new THREE.Color(0xffc0cb), // 粉红色
        // 红色系
        new THREE.Color(0xff1744), // 红色
        new THREE.Color(0xff5252), // 浅红色
        new THREE.Color(0xff8a80), // 淡红色
        new THREE.Color(0xd32f2f), // 深红色
        new THREE.Color(0xf44336), // 亮红色
        // 紫色系
        new THREE.Color(0xce93d8), // 淡紫色
        new THREE.Color(0xba68c8), // 紫色
        new THREE.Color(0xab47bc), // 深紫色
        new THREE.Color(0x9c27b0), // 紫色
        new THREE.Color(0x7b1fa2), // 深紫
        // 橙色系
        new THREE.Color(0xff9800), // 橙色
        new THREE.Color(0xff6f00), // 深橙色
        new THREE.Color(0xffb74d), // 浅橙色
        new THREE.Color(0xffa726), // 亮橙色
        // 黄色系
        new THREE.Color(0xffeb3b), // 黄色
        new THREE.Color(0xffc107), // 金黄色
        new THREE.Color(0xffd54f), // 浅黄色
        // 蓝色系
        new THREE.Color(0x2196f3), // 蓝色
        new THREE.Color(0x1976d2), // 深蓝色
        new THREE.Color(0x64b5f6), // 浅蓝色
        new THREE.Color(0x42a5f5), // 亮蓝色
        // 青色系
        new THREE.Color(0x00bcd4), // 青色
        new THREE.Color(0x0097a7), // 深青色
        new THREE.Color(0x4dd0e1), // 浅青色
        // 绿色系
        new THREE.Color(0x4caf50), // 绿色
        new THREE.Color(0x388e3c), // 深绿色
        new THREE.Color(0x81c784), // 浅绿色
        new THREE.Color(0x66bb6a), // 亮绿色
        new THREE.Color(0xa5d6a7), // 极浅绿
        // 混合色
        new THREE.Color(0xff6b9d), // 粉橙
        new THREE.Color(0xff4081), // 粉红
        new THREE.Color(0xe91e63), // 玫瑰
        // 更多粉红变化
        new THREE.Color(0xff1493), // 深粉红
        new THREE.Color(0xff69b4), // 热粉红
        new THREE.Color(0xffb6c1), // 浅粉红
        new THREE.Color(0xffc0cb), // 粉红
        new THREE.Color(0xff91a4), // 粉红
        // 更多红色变化
        new THREE.Color(0xc51162), // 深粉红
        new THREE.Color(0xff1744), // 亮红
        new THREE.Color(0xff6d00), // 橙红
        // 更多紫色变化
        new THREE.Color(0x6a1b9a), // 深紫
        new THREE.Color(0x8e24aa), // 紫色
        new THREE.Color(0xaa00ff), // 亮紫
        new THREE.Color(0xce93d8), // 淡紫
        // 更多橙色变化
        new THREE.Color(0xff6d00), // 深橙
        new THREE.Color(0xff9100), // 橙色
        new THREE.Color(0xffab40), // 浅橙
        // 更多黄色变化
        new THREE.Color(0xffd600), // 亮黄
        new THREE.Color(0xffea00), // 黄色
        new THREE.Color(0xfff176), // 浅黄
        // 更多蓝色变化
        new THREE.Color(0x0d47a1), // 深蓝
        new THREE.Color(0x1565c0), // 蓝色
        new THREE.Color(0x90caf9), // 浅蓝
        new THREE.Color(0xbbdefb), // 极浅蓝
        // 更多青色变化
        new THREE.Color(0x006064), // 深青
        new THREE.Color(0x00838f), // 青色
        new THREE.Color(0x80deea), // 浅青
        // 彩虹色
        new THREE.Color(0xff1744), // 红
        new THREE.Color(0xff6f00), // 橙
        new THREE.Color(0xffeb3b), // 黄
        new THREE.Color(0x4caf50), // 绿
        new THREE.Color(0x00bcd4), // 青
        new THREE.Color(0x2196f3), // 蓝
        new THREE.Color(0x9c27b0), // 紫
        // 更多粉红变化
        new THREE.Color(0xff9ec8), // 浅粉
        new THREE.Color(0xff8cc8), // 粉红
        new THREE.Color(0xff7eb8), // 粉红
        new THREE.Color(0xff6fa8), // 粉红
        new THREE.Color(0xff5c98), // 粉红
        // 更多红色变化
        new THREE.Color(0xff3d5a), // 深粉红
        new THREE.Color(0xff2d4a), // 深红
        new THREE.Color(0xff1d3a), // 深红
        new THREE.Color(0xff0d2a), // 深红
        // 更多紫色变化
        new THREE.Color(0x9575cd), // 浅紫
        new THREE.Color(0x7986cb), // 蓝紫
        new THREE.Color(0x5c6bc0), // 蓝紫
        new THREE.Color(0x3f51b5), // 靛蓝
        // 更多橙色变化
        new THREE.Color(0xffcc80), // 浅橙
        new THREE.Color(0xffb74d), // 橙
        new THREE.Color(0xffa726), // 橙
        new THREE.Color(0xff9800), // 橙
        // 更多黄色变化
        new THREE.Color(0xfff59d), // 极浅黄
        new THREE.Color(0xfff176), // 浅黄
        new THREE.Color(0xffee58), // 黄
        new THREE.Color(0xffeb3b), // 亮黄
        // 更多蓝色变化
        new THREE.Color(0x448aff), // 亮蓝
        new THREE.Color(0x2979ff), // 蓝
        new THREE.Color(0x2962ff), // 深蓝
        new THREE.Color(0x304ffe), // 深蓝
        // 更多青色变化
        new THREE.Color(0x26c6da), // 亮青
        new THREE.Color(0x00acc1), // 青
        new THREE.Color(0x0097a7), // 深青
        // 更多绿色变化
        new THREE.Color(0x81c784), // 浅绿
        new THREE.Color(0x66bb6a), // 绿
        new THREE.Color(0x4caf50), // 亮绿
        new THREE.Color(0x43a047), // 深绿
        // 暖色混合
        new THREE.Color(0xff6b6b), // 珊瑚红
        new THREE.Color(0xff8e53), // 橙红
        new THREE.Color(0xffa726), // 金橙
        new THREE.Color(0xffcc02), // 金黄
        // 冷色混合
        new THREE.Color(0x26a69a), // 青绿
        new THREE.Color(0x00897b), // 深青绿
        new THREE.Color(0x00695c), // 深绿
        // 特殊色
        new THREE.Color(0xec407a), // 粉紫
        new THREE.Color(0xab47bc), // 紫红
        new THREE.Color(0x7e57c2), // 蓝紫
        new THREE.Color(0x5e35b1), // 深紫蓝
        new THREE.Color(0x3949ab)  // 靛蓝
    ];

    // 生成填充爱心的粒子（使用优化的心形参数方程 + 径向缩放来填充内部）
    for (let i = 0; i < count; i++) {
        const t = Math.random() * Math.PI * 2;
        // 径向缩放因子，从0到1，使粒子填充整个爱心内部
        const r = Math.sqrt(Math.random()); // 使用平方根使分布更均匀

        // 经典心形参数方程（最常见的爱心形状）
        const sinT = Math.sin(t);
        const x0 = 16 * Math.pow(sinT, 3);
        const y0 =
            13 * Math.cos(t) -
            5 * Math.cos(2 * t) -
            2 * Math.cos(3 * t) -
            Math.cos(4 * t);

        // 应用径向缩放，填充爱心内部
        const x = x0 * r;
        const y = y0 * r;
        const z = (Math.random() - 0.5) * 1.2; // 减小厚度，使形状更清晰

        // 使用自适应缩放比例，使爱心根据屏幕宽度占满
        const scale = baseScale;
        vertices.push(x * scale, (y - 1.5) * scale, z * scale * 0.8);

        // 为每个粒子随机分配情人节色彩
        const color = valentineColors[
            Math.floor(Math.random() * valentineColors.length)
        ];
        // 保存基础颜色
        baseColors.push(color.r, color.g, color.b);
        colors.push(color.r, color.g, color.b);

        // 为每个粒子添加随机闪烁频率值（0.5 到 2.0）
        sparkleValues.push(0.5 + Math.random() * 1.5);
    }

    geometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(vertices, 3)
    );
    const colorAttribute = new THREE.Float32BufferAttribute(colors, 3);
    geometry.setAttribute("color", colorAttribute);

    // 根据屏幕宽度计算粒子大小（增大粒子以确保可见）
    const basePointSize = 0.045;
    const screenFactor = Math.min(window.innerWidth / 1920, 1.5); // 以1920px为基准
    const pointSize = basePointSize * screenFactor;

    // 使用 PointsMaterial 实现闪烁效果（通过动态更新颜色）
    material = new THREE.PointsMaterial({
        size: pointSize,
        transparent: true,
        opacity: 1.0, // 提高不透明度
        vertexColors: true,
        sizeAttenuation: true
    });

    points = new THREE.Points(geometry, material);
    scene.add(points);

    console.log("Particles created:", count);
    console.log("Point size:", pointSize);
    console.log("Points scale:", baseScale);

    clock = new THREE.Clock();
    window.addEventListener("resize", onWindowResize);

    // 初始化烟花
    initFireworks();
}

// 初始化烟花
function initFireworks() {
    if (!rainCanvas.value) return;

    const canvas = rainCanvas.value;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    rainCtx = canvas.getContext("2d");

    fireworks = [];
    lastFireworkTime = Date.now();

    animateFireworks();
}

// 创建新烟花
function createFirework() {
    const colorSets = [
        // 粉红系
        ["#ff3366", "#ff6b9d", "#ffb3d9", "#ffc0cb"],
        // 红色系
        ["#ff1744", "#ff5252", "#ff8a80", "#ffcdd2"],
        // 玫瑰系
        ["#e91e63", "#f50057", "#ff4081", "#f8bbd0"],
        // 紫色系
        ["#ce93d8", "#ba68c8", "#ab47bc", "#e1bee7"],
        // 混合系
        ["#ff6b9d", "#ff4081", "#ff1744", "#ffb3d9"],
        // 橙色系
        ["#ff9800", "#ff6f00", "#ffb74d", "#ffe0b2"],
        // 黄色系
        ["#ffeb3b", "#ffc107", "#ffd54f", "#fff9c4"],
        // 蓝色系
        ["#2196f3", "#1976d2", "#64b5f6", "#bbdefb"],
        // 青色系
        ["#00bcd4", "#0097a7", "#4dd0e1", "#b2ebf2"],
        // 绿色系
        ["#4caf50", "#388e3c", "#81c784", "#c8e6c9"],
        // 深红系
        ["#c2185b", "#880e4f", "#e91e63", "#f48fb1"],
        // 深紫系
        ["#7b1fa2", "#6a1b9a", "#9c27b0", "#ce93d8"],
        // 彩虹混合
        ["#ff3366", "#ff9800", "#ffeb3b", "#4caf50"],
        // 暖色混合
        ["#ff1744", "#ff6b00", "#ffc107", "#ff6b9d"],
        // 冷色混合
        ["#2196f3", "#00bcd4", "#4caf50", "#9c27b0"]
    ];

    const x = Math.random() * window.innerWidth;
    // 让烟花飞得更高，在屏幕上半部分爆炸（从15%到50%的高度）
    const targetY = window.innerHeight * 0.15 + Math.random() * (window.innerHeight * 0.35);
    const colorSet = colorSets[Math.floor(Math.random() * colorSets.length)];

    const initialVy = -12 - Math.random() * 8;
    fireworks.push({
        x: x,
        y: window.innerHeight,
        targetY: targetY,
        vx: (Math.random() - 0.5) * 2, // 水平速度
        vy: initialVy, // 增加向上速度，让烟花飞得更高
        prevVy: initialVy, // 上一帧的速度，用于检测最高点
        particles: [], // 爆炸粒子
        exploded: false,
        colorSet: colorSet, // 颜色组
        mainColor: colorSet[0],
        flashTime: 0, // 闪光时间
        trail: [] // 拖尾
    });
}

// 将十六进制颜色转换为rgba
function hexToRgba(hex, alpha) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// 绘制带发光的粒子
function drawGlowParticle(ctx, x, y, size, color, alpha) {
    ctx.save();

    // 外层发光
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, size * 2);
    gradient.addColorStop(0, hexToRgba(color, alpha));
    gradient.addColorStop(0.5, hexToRgba(color, alpha * 0.5));
    gradient.addColorStop(1, hexToRgba(color, 0));

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, size * 2, 0, Math.PI * 2);
    ctx.fill();

    // 内层核心
    ctx.fillStyle = hexToRgba(color, alpha);
    ctx.beginPath();
    ctx.arc(x, y, size * 0.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
}

// 烟花动画
function animateFireworks() {
    if (!rainCtx || !rainCanvas.value) return;

    const canvas = rainCanvas.value;
    const ctx = rainCtx;

    // 清空画布（使用半透明背景实现拖尾效果）
    ctx.fillStyle = "rgba(26, 26, 46, 0.2)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const currentTime = Date.now();

    // 定期发射新烟花（每1.5-3秒）
    if (currentTime - lastFireworkTime > 1500 + Math.random() * 1500) {
        // 随机发射1-4个烟花
        const fireworkCount = 1 + Math.floor(Math.random() * 4);
        for (let i = 0; i < fireworkCount; i++) {
            createFirework();
        }
        lastFireworkTime = currentTime;
    }

    // 更新和绘制每个烟花
    for (let i = fireworks.length - 1; i >= 0; i--) {
        const firework = fireworks[i];

        if (!firework.exploded) {
            // 保存上一帧的速度，用于检测最高点
            const prevVy = firework.vy;

            // 烟花上升阶段
            firework.x += firework.vx;
            firework.y += firework.vy;
            firework.vy += 0.2; // 重力

            // 添加拖尾（更真实的火花拖尾）
            firework.trail.push({
                x: firework.x,
                y: firework.y,
                opacity: 1,
                size: 3
            });
            if (firework.trail.length > 12) {
                firework.trail.shift();
            }

            // 绘制上升的烟花（带真实火花拖尾）
            ctx.save();
            // 绘制拖尾 - 使用渐变和发光效果
            for (let j = 0; j < firework.trail.length; j++) {
                const point = firework.trail[j];
                const trailAlpha = (j / firework.trail.length) * 0.9;
                const trailSize = point.size * (1 - j / firework.trail.length);

                // 绘制发光拖尾
                drawGlowParticle(ctx, point.x, point.y, trailSize, firework.mainColor, trailAlpha);
            }
            // 绘制烟花主体（更亮）
            drawGlowParticle(ctx, firework.x, firework.y, 5, firework.mainColor, 1);
            ctx.restore();

            // 检查是否应该爆炸（到达目标高度或到达最高点）
            const shouldExplode =
                firework.y <= firework.targetY || // 到达目标高度
                (prevVy < 0 && firework.vy >= 0) || // 到达最高点（速度从负变正）
                firework.vy > 0.5; // 已经开始明显下落

            if (shouldExplode) {
                firework.exploded = true;
                firework.flashTime = 3; // 闪光持续3帧

                // 创建多层爆炸粒子（更真实的爆炸效果）
                const particleCount = 50 + Math.random() * 30;
                for (let j = 0; j < particleCount; j++) {
                    const angle = (Math.PI * 2 * j) / particleCount + (Math.random() - 0.5) * 0.8;
                    const speed = 3 + Math.random() * 5;
                    const colorIndex = Math.floor(Math.random() * firework.colorSet.length);

                    firework.particles.push({
                        x: firework.x,
                        y: firework.y,
                        vx: Math.cos(angle) * speed,
                        vy: Math.sin(angle) * speed,
                        life: 1.0,
                        decay: 0.012 + Math.random() * 0.008,
                        size: 2.5 + Math.random() * 3.5,
                        color: firework.colorSet[colorIndex],
                        trail: [] // 每个粒子的拖尾
                    });
                }
            }
        } else {
            // 爆炸闪光效果
            if (firework.flashTime > 0) {
                ctx.save();
                const flashAlpha = firework.flashTime / 3 * 0.6;
                const flashGradient = ctx.createRadialGradient(
                    firework.x, firework.y, 0,
                    firework.x, firework.y, 80
                );
                flashGradient.addColorStop(0, "rgba(255, 255, 255, " + flashAlpha + ")");
                flashGradient.addColorStop(0.3, hexToRgba(firework.mainColor, flashAlpha * 0.5));
                flashGradient.addColorStop(1, hexToRgba(firework.mainColor, 0));
                ctx.fillStyle = flashGradient;
                ctx.beginPath();
                ctx.arc(firework.x, firework.y, 80, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
                firework.flashTime--;
            }

            // 爆炸粒子阶段
            let hasAliveParticles = false;

            for (let j = firework.particles.length - 1; j >= 0; j--) {
                const particle = firework.particles[j];

                // 更新粒子位置（更真实的物理）
                particle.x += particle.vx;
                particle.y += particle.vy;
                particle.vy += 0.12; // 重力
                particle.vx *= 0.985; // 空气阻力
                particle.vy *= 0.985;
                particle.life -= particle.decay;

                // 添加粒子拖尾
                particle.trail.push({ x: particle.x, y: particle.y });
                if (particle.trail.length > 4) {
                    particle.trail.shift();
                }

                // 绘制粒子（带拖尾和发光）
                if (particle.life > 0) {
                    hasAliveParticles = true;
                    ctx.save();

                    // 绘制拖尾
                    for (let k = 0; k < particle.trail.length; k++) {
                        const trailPoint = particle.trail[k];
                        const trailAlpha = (k / particle.trail.length) * particle.life * 0.6;
                        const trailSize = particle.size * (1 - k / particle.trail.length) * particle.life;
                        drawGlowParticle(ctx, trailPoint.x, trailPoint.y, trailSize, particle.color, trailAlpha);
                    }

                    // 绘制粒子主体
                    drawGlowParticle(ctx, particle.x, particle.y, particle.size * particle.life, particle.color, particle.life);

                    ctx.restore();
                } else {
                    firework.particles.splice(j, 1);
                }
            }

            // 如果所有粒子都消失了，移除这个烟花
            if (!hasAliveParticles && firework.flashTime <= 0) {
                fireworks.splice(i, 1);
            }
        }
    }

    rainAnimationId = requestAnimationFrame(animateFireworks);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);

    // 重新计算缩放比例
    calculateScale();

    // 更新粒子的缩放以适应新屏幕大小
    if (points) {
        // 获取当前的呼吸动画缩放值（如果有）
        const currentBreathScale = points.scale.x / (baseScale || 1);
        // 直接设置新的基础缩放
        points.scale.set(baseScale, baseScale, baseScale);

        // 调整粒子大小以适应屏幕
        if (material) {
            // 根据屏幕宽度调整粒子大小，保持视觉一致性
            const basePointSize = 0.045;
            const screenFactor = Math.min(window.innerWidth / 1920, 1.5); // 以1920px为基准
            material.size = basePointSize * screenFactor;
        }
    }

    // 更新爱心雨canvas大小
    if (rainCanvas.value) {
        rainCanvas.value.width = window.innerWidth;
        rainCanvas.value.height = window.innerHeight;
    }
}

function animate() {
    animationId = requestAnimationFrame(animate);
    const time = clock.getElapsedTime();

    // 呼吸动画（轻微缩放），基于基础缩放比例
    const breathScale = 1 + 0.05 * Math.sin(time * 2.5);
    const finalScale = baseScale * breathScale;
    points.scale.set(finalScale, finalScale, finalScale);

    // 动态更新颜色实现闪烁效果
    if (geometry && baseColors && sparkleValues) {
        const colors = geometry.attributes.color.array;
        for (let i = 0; i < sparkleValues.length; i++) {
            const sparkleFreq = sparkleValues[i];
            // 计算闪烁强度
            const sparkleIntensity = Math.sin(time * sparkleFreq * 3.0) * 0.5 + 0.5;
            const brightness = 0.7 + Math.pow(sparkleIntensity, 0.7) * 0.5;

            // 更新颜色（带发光效果）
            const baseIdx = i * 3;
            const glow = sparkleIntensity * 0.3;
            colors[baseIdx] = baseColors[baseIdx] * brightness + glow;     // R
            colors[baseIdx + 1] = baseColors[baseIdx + 1] * brightness + glow; // G
            colors[baseIdx + 2] = baseColors[baseIdx + 2] * brightness + glow; // B
        }
        geometry.attributes.color.needsUpdate = true;
    }

    renderer.render(scene, camera);
}
  </script>

  <style scoped>
  .heart-container {
    width: 100vw;
    height: 100vh;
    background:
      radial-gradient(circle at 20% 30%, rgba(255, 51, 102, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 70%, rgba(255, 23, 68, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 50% 50%, rgba(206, 147, 216, 0.08) 0%, transparent 60%),
      linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
    overflow: hidden;
    position: relative;
  }

  .rain-canvas {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 0;
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

.romantic-text {
    width: 100%;
    font-size: 16px;
    font-weight: bold;
    color: #fff;
    text-shadow: 2px 2px 10px rgba(255, 20, 147, 0.8), 0 0 20px rgba(255, 105, 180, 0.6);
    z-index: 3;
    position: absolute;
    left: 0;
    bottom: 30px;
    text-align: center;
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
        transform: translateX(-50%) translateY(0);
    }
    50% {
        transform: translateX(-50%) translateY(-3px);
    }
}
  </style>
