const routes = [
    {
        path: "/",
        name: "Home",
        meta: {
            title: "Home"
        },
        component: () => import("../pages/Home.vue")
    },
    {
        path: "/heart",
        name: "Heart",
        meta: {
            title: "Heart"
        },
        component: () => import("../pages/Heart.vue")
    },
    {
        path: "/mcp",
        name: "MCP",
        meta: {
            title: "MCP"
        },
        component: () => import("../pages/MCP.vue")
    }
];

export default routes;
