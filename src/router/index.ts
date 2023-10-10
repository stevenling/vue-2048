import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "app",
    component: () => import("../views/index.vue"),
  },
  {
    path: "/scoreRank",
    name: "ScoreRank",
    component: () => import("../views/ScoreRank.vue"),
  },
];

const index = createRouter({
  history: createWebHistory(),
  routes,
});

export default index;