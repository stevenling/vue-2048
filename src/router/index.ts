import {
  createRouter,
  createWebHashHistory,
  RouterOptions,
  Router,
  RouteRecordRaw,
} from "vue-router";

const routes: RouteRecordRaw[] = [
  { path: "/", name: "Home", component: () => import("../views/index.vue") },
  {
    path: "/scoreRank",
    name: "ScoreRank",
    component: () => import("../views/ScoreRank.vue"),
  },
];

// RouterOptions 是路由选项类型
const options: RouterOptions = {
  history: createWebHashHistory(),
  routes,
};

// Router是路由对象类型
const router: Router = createRouter(options);

export default router;
