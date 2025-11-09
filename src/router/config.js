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
            title: "Heart",
            hideHeader: false
        },
        component: () => import("../pages/Heart.vue")
    },
    {
        path: "/experiment",
        name: "Experiment",
        meta: {
            title: "Experiment"
        },
        component: () => import("../pages/Experiment.vue")
    }
];

export default routes;
