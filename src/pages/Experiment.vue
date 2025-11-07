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
        <div class="heart-container">
            <canvas ref="canvasRef" class="heart-canvas"></canvas>
        </div>
        <div class="romantic-text">Love You Forever 💕</div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";

const canvasRef = ref(null);
let animationId = null;
let particles = [];
const particleCount = 1000; // 增加粒子数量，形成更完整的爱心形状

// 多彩颜色数组
const colors = [
    "#ff1744", "#ff6b9d", "#ff4081", "#e91e63", "#c2185b", // 红色系
    "#ff9800", "#ff5722", "#ff6f00", "#ff3d00", // 橙色系
    "#ffeb3b", "#ffc107", "#ffca28", // 黄色系
    "#4caf50", "#8bc34a", "#66bb6a", // 绿色系
    "#2196f3", "#03a9f4", "#00bcd4", "#0097a7", // 蓝色系
    "#9c27b0", "#e91e63", "#ba68c8", "#ab47bc", // 紫色系
    "#fff", "#ffe0e6", "#ffebee", "#fff5f5" // 白色系
];

// 粒子类
class Particle {
    constructor(x, y, size, color) {
        this.x = x;
        this.y = y;
        this.baseX = x;
        this.baseY = y;
        this.size = size;
        this.color = color;
        this.opacity = 0.7 + Math.random() * 0.3;
        this.life = Math.random() * Math.PI * 2;
        this.speed = 0.02 + Math.random() * 0.03;
        this.radius = 1 + Math.random() * 2; // 粒子围绕基础位置的半径
    }

    update() {
        // 粒子围绕基础位置做轻微的圆周运动
        this.life += this.speed;
        this.x = this.baseX + Math.cos(this.life) * this.radius;
        this.y = this.baseY + Math.sin(this.life) * this.radius;
    }

    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.opacity;

        // 绘制粒子主体
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();

        // 添加光晕效果
        const gradient = ctx.createRadialGradient(
            this.x, this.y, 0,
            this.x, this.y, this.size * 3
        );
        gradient.addColorStop(0, this.color);
        gradient.addColorStop(0.5, this.color + "80");
        gradient.addColorStop(1, "transparent");
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }
}

// 绘制爱心形状
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

// 检查点是否在爱心内部
const isPointInHeart = (x, y, centerX, centerY, size) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = size * 2;
    canvas.height = size * 2;
    drawHeart(ctx, centerX, centerY, size);
    return ctx.isPointInPath(x, y);
};

// 初始化粒子系统（多彩粒子填充爱心）
const initParticles = (centerX, centerY, heartSize) => {
    particles = [];

    // 使用网格化方式在爱心内部均匀分布粒子
    const gridSize = 8;
    const startX = centerX - heartSize / 2;
    const startY = centerY - heartSize / 2;

    for (let y = startY; y < startY + heartSize; y += gridSize) {
        for (let x = startX; x < startX + heartSize; x += gridSize) {
            // 检查点是否在爱心内部
            if (isPointInHeart(x, y, centerX, centerY, heartSize)) {
                const size = 2 + Math.random() * 2.5;
                const color = colors[Math.floor(Math.random() * colors.length)];
                particles.push(new Particle(x, y, size, color));
            }
        }
    }

    // 补充一些随机粒子，让填充更完整
    let attempts = 0;
    while (particles.length < particleCount && attempts < 5000) {
        attempts++;
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * (heartSize / 2 - 5);
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;

        if (isPointInHeart(x, y, centerX, centerY, heartSize)) {
            // 检查是否与已有粒子太近
            let tooClose = false;
            for (let i = 0; i < particles.length && !tooClose; i++) {
                const p = particles[i];
                const dist = Math.sqrt(Math.pow(p.baseX - x, 2) + Math.pow(p.baseY - y, 2));
                if (dist < gridSize * 0.8) {
                    tooClose = true;
                }
            }

            if (!tooClose) {
                const size = 2 + Math.random() * 2.5;
                const color = colors[Math.floor(Math.random() * colors.length)];
                particles.push(new Particle(x, y, size, color));
            }
        }
    }
};

// 绘制爱心和多彩粒子
const draw = () => {
    const canvas = canvasRef.value;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const size = 350;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // 清空画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 绘制半透明爱心背景（可选，让粒子更突出）
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, size / 2);
    gradient.addColorStop(0, "rgba(255, 107, 157, 0.2)");
    gradient.addColorStop(0.5, "rgba(255, 23, 68, 0.3)");
    gradient.addColorStop(1, "rgba(194, 24, 91, 0.4)");

    drawHeart(ctx, centerX, centerY, size);
    ctx.fillStyle = gradient;
    ctx.fill();

    // 添加爱心边框（可选）
    ctx.strokeStyle = "rgba(255, 235, 238, 0.5)";
    ctx.lineWidth = 2;
    drawHeart(ctx, centerX, centerY, size);
    ctx.stroke();

    // 更新并绘制所有粒子
    particles.forEach(particle => {
        particle.update();
        particle.draw(ctx);
    });
};

// 初始化画布
const initCanvas = () => {
    const canvas = canvasRef.value;
    if (!canvas) return;

    canvas.width = 700;
    canvas.height = 700;

    const size = 350;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // 初始化粒子系统
    initParticles(centerX, centerY, size);

    // 粒子动画渲染（移除心跳效果）
    const animate = () => {
        // 绘制粒子系统
        draw();

        animationId = requestAnimationFrame(animate);
    };
    animate();
};

onMounted(() => {
    initCanvas();
});

onUnmounted(() => {
    if (animationId) {
        cancelAnimationFrame(animationId);
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
    background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%);
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
}

.floating-heart {
    position: absolute;
    font-size: 20px;
    animation: float 15s infinite linear;
    opacity: 0.6;
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
        opacity: 0.6;
    }
    90% {
        opacity: 0.6;
    }
    100% {
        transform: translateY(-100px) rotate(360deg);
        opacity: 0;
    }
}

.heart-container {
    position: relative;
    z-index: 1;
    animation: heartBeat 2.5s ease-in-out infinite;
}

.heart-canvas {
    display: block;
    filter: drop-shadow(0 0 20px rgba(255, 20, 147, 0.5));
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
    z-index: 1;
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
