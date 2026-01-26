function setPageTitle({ to } = {}) {
    const { meta } = to;
    const { title } = meta;

    document.title = title ? `${title}` : "Portal";
}

function onBeforeEach({ to, from: _from, next: _next } = {}) {
    setPageTitle({ to });
}

function onAfterEach() {
    // 路由切换后滚动到顶部
    window.scrollTo(0, 0);
}

export {  onBeforeEach, onAfterEach };
