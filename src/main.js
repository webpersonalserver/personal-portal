import { createApp } from "vue";
import "./style.css";
import "./css/animation.less";
import App from "./App.vue";
import router from "./router";
// Arco Design 样式（按需引入时仍需要引入样式）
import "@arco-design/web-vue/dist/arco.css";

const app = createApp(App);

// 不需要全局注册，使用 unplugin-vue-components 实现按需引入
// 组件会在使用时自动导入

app.use(router);

app.mount("#app");
